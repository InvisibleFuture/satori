import md5 from 'md5'
import random from 'string-random'
import formidable from 'formidable'
import { db, User, Blog, Tag, File } from '../../model'

// 获取对象
export default defineEventHandler(async event => {
  // 检查目标对象类型是否存在
  if (!db.isDefined(event.context.params.name)) {
    event.res.statusCode = 404
    return '对象类型不存在'
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

  // 确认对象存在(GET 以外都需要确认目标存在, 而GET需要附加额外信息)
  let object = await db.model(event.context.params.name).findOne({
    where:{id:event.context.params.id}
  })
  if (!object) {
    event.res.statusCode = 404
    return '目标对象不存在'
  }

  // 增删改查标准操作(覆写)
  if (event.req.method === 'SET') {
    return await db.model(event.context.params.name).update(event.req.body, {
      where:{ id: event.context.params.id }
    })
  }

  // 增删改查标准操作(创建)
  if (event.req.method === 'POST') {
    if (!event.req.account) {
      event.res.statusCode = 400
      return '尚未登录'
    }

    // TODO: 如果是上传图片, 检查是否有权限
    // TODO: 验证挂载目标是否有权限写
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
              userId: event.req.account.id,
              name: item.originalFilename,
              size: item.size,
              path: item.filepath,
              type: item.mimetype,
            }
            if (event.context.params.name === 'blog') {
              ipx.blogId = event.context.params.id
            }
            if (event.context.params.name === 'gallery') {
              ipx.galleryId = event.context.params.id
            }
            list.push(ipx)
          })
        }
        db.model('file').bulkCreate(list, { returning:true }).then(result => {
          resolve(result)
        })
      })
    }))
    return list
  }

  // 增删改查标准操作(修改)
  if (event.req.method === 'PATCH') {
    let query = { where:{ id: event.context.params.id } }

    // 为 user 作额外处理
    if (event.context.params.name === 'user') {
      delete event.req.body.salt     // 禁止单独修改 salt
      if (event.req.body.password) { // TODO: 也不可以为空, 必须是 null
        if (typeof(event.req.body.password) !== 'string') return '密码必须是字符串'
        if (event.req.body.password === '') return '密码不能为空' // TODO: 密码最小长度
        event.req.body.salt = random(32)
        event.req.body.password = md5(event.req.body.password + event.req.body.salt)
      }
    }

    // 为 blog 作额外处理
    //if (event.context.params.name === 'blog') {
    //  // event.req.body.tags = []
    //  query.include = [ Tag ]
    //}

    // TODO: 检查危险的属性, 放行管理员
    return await db.model(event.context.params.name).update(event.req.body, query)
  }

  // 增删改查标准操作(删除)
  if (event.req.method === 'DELETE') {
    return await db.model(event.context.params.name).destroy({
      where: { id: event.context.params.id }
    })
  }

  return '尚未支持的操作'
})
