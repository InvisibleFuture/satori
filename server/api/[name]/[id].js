import md5 from 'md5'
import random from 'string-random'
import formidable from 'formidable'
import { db, User, Blog, Tag, File } from '../../model'

// 获取对象
export default defineEventHandler(async event => {

  // 验证 cookie
  let sid = useCookie(event.req, 'sid')
  console.log('验证 cookie', sid)
  if (sid) {
    console.log('获取对应 id')
    let id  = await useStorage().getItem('session:' + sid)
    if (id) {
      let userinfo = await db.model('user').findOne({where: { id }})
      if (userinfo) {
        console.log('userinfo cookie')
        console.log(userinfo)
        // 通过验证以允许使用登录状态的 id
      } else {
        // 会话仍有效, 但用户已不存在, error
        console.log('会话仍有效, 但用户已不存在, error')
      }
    } else {
      // 有cookie却已失效, 注销此 cookie(没有存储对应id)
      console.log('remove cookie')
      setCookie(event.res, 'sid', 'xxx')
    }
  } else {
    // 没有cookie, 不可以使用身份验证要求的内容
    console.log('没有cookie, 不可以使用身份验证要求的内容')
  }

  // 确认表存在
  if (!db.isDefined(event.context.params.name)) {
    event.res.statusCode = 404
    return '对象不存在'
  }

  // TODO: 确认对象存在

  // 接收数据
  const body = function() {
    return new Promise(resolve => {
      let data = ''
      event.req.on('data', (chunk) => data += chunk)
      event.req.on('end', () => resolve(decodeURI(data)))
    })
  }

  // 增删改查标准操作(查询)
  if (event.req.method === 'GET') {
    // 整理支持的查询条件
    const query = {where:{ id: event.context.params.id }}
    
    // 对 blog 特别附加
    if (event.context.params.name === 'blog') {
      query.include = [
        { model: User, attributes: ['name', 'age'] },
        { model: Tag, attributes: ['id', 'name'], through: { attributes: [] }},
        { model: File, attributes: ['id','name','type', 'size'] },
      ]
    }

    // 对 tag 特别附加
    if (event.context.params.name === 'tag') {
      query.include = [
        { model: Blog, attributes: ['id', 'name'], through: { attributes: [] }}
      ]
    }

    // 对 tag 特别附加(查询指定标签的所有 blog 索引)
    // 因而 标签中包含多个blog, blog中也包含多个标签
    let data = await db.model(event.context.params.name).findOne(query)
    if (!data) {
      event.res.statusCode = 404
      return '资源不存在'
    }

    return data
  }

  // 增删改查标准操作(覆写)
  if (event.req.method === 'SET') {
    let data = JSON.parse(await body())
    return await db.model(event.context.params.name).update(data, {
      where:{ id: event.context.params.id }
    })
  }

  // 增删改查标准操作(创建)
  if (event.req.method === 'POST') {
    // TODO: 如果是上传图片, 检查是否有权限
    const list = await (new Promise(resolve => {
      formidable({
        multiples: true,
        uploadDir: 'data/file',
        keepExtensions: true,
        maxFieldsSize: 200 * 1024 * 1024
      }).parse(event.req, function (err, fields, files) {
        let list = []
        for (let key in files) {
          (Array.isArray(files[key]) ? files[key] : [files[key]]).map(item => {
            let ipx = {
              name: item.originalFilename,
              size: item.size,
              path: item.filepath,
              type: item.mimetype,
            }
            if (event.context.params.name === 'blog') {
              ipx.blogId = event.context.params.id
            }
            //if (event.context.params.name === '') {}
            list.push(ipx)
          })
        }
        db.model('file').bulkCreate(list, { returning:true }).then(result => {
          console.log(result)
          resolve(result)
        })
      })
    }))
    return list
  }

  // 增删改查标准操作(修改)
  if (event.req.method === 'PATCH') {
    let data = JSON.parse(await body())
    let query = { where:{ id: event.context.params.id } }

    // 为 user 作额外处理
    if (event.context.params.name === 'user') {
      // 禁止单独修改 salt
      delete data.salt
      
      // TODO: 也不可以为空, 必须是 null
      if (data.password) {
        if (typeof(data.password) !== 'string') return '密码必须是字符串'
        if (data.password === '') return '密码不能为空' // TODO: 密码最小长度
        data.salt = random(32)
        data.password = md5(data.password + data.salt)
      }
    }

    // 为 blog 作额外处理
    //if (event.context.params.name === 'blog') {
    //  // data.tags = []
    //  query.include = [ Tag ]
    //}

    // TODO: 检查危险的属性, 放行管理员
    return await db.model(event.context.params.name).update(data, query)
  }

  // 增删改查标准操作(删除)
  if (event.req.method === 'DELETE') {
    return await db.model(event.context.params.name).destroy({
      where: { id: event.context.params.id }
    })
  }

  return '尚未支持的操作'
})
