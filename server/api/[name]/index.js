import { db, User } from '../../model'

// 获取列表
export default defineEventHandler(async event => {
  // await User.create({name: 'Last', age:11})
  // await useStorage().setItem('test:foo', { hello: 'world' })
  // const aaax = await useStorage().getItem('test:foo')
  // sequelize.models - 实例中已定义的模型
  // sequelize.isDefined() - 检查模型是否定义
  // sequelize.model() - 获取模型

  // 验证 cookie
  console.log('验证 cookie')
  let sid = useCookie(event.req, 'sid')
  console.log(sid)
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
      setCookie(event.res, 'sid', '', {
        maxAge: -1
      })
    }
  } else {
    // 没有cookie, 不可以使用身份验证要求的内容
    console.log('没有cookie, 不可以使用身份验证要求的内容')
  }


  if (!db.isDefined(event.context.params.name)) {
    event.res.statusCode = 404
    return '类型不存在'
  }

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
    // 先整理支持的查询条件 raw: false
    const query = {}

    // 分页条件 (page pagesize)
    // 查询条件 (name, ..)
    // 检索条件 (search, lt, rt)
    // 排序条件 (sort desc)

    // 对 blog 特别附加
    if (event.context.params.name === 'blog') {
      query.include = [{
        model: User,
        attributes: ['name', 'age'],
      }]
    }

    return {
      name: event.context.params.name,
      list: await db.model(event.context.params.name).findAll(query),
    }
  }

  // 增删改查标准操作(覆写)
  // if (event.req.method === 'SET') {
  //   let data = JSON.parse(await body())
  //   return await db.model(event.context.params.name).update(data, {
  //     where:{ id: event.context.params.id }
  //   })
  // }

  // 增删改查标准操作(创建)
  if (event.req.method === 'POST') {
    let data = JSON.parse(await body())
    // TODO: 检查危险的属性, 放行管理员
    // TODO: 如果是创建用户, 对用户名检查占用
    // TODO: 如果是创建用户, 对密码作盐处理
    return await db.model(event.context.params.name).create(data)
  }

  // 增删改查标准操作(修改)
  //if (event.req.method === 'PATCH') {
  //  let data = JSON.parse(await body())
  //  // TODO: 检查危险的属性, 放行管理员
  //  return await db.model(event.context.params.name).update(data, {
  //    where:{ id: event.context.params.id }
  //  })
  //}

  // 增删改查标准操作(删除)
  //if (event.req.method === 'DELETE') {
  //  return await db.model(event.context.params.name).destroy({
  //    where: { id: event.context.params.id }
  //  })
  //}

  return '尚未支持的操作'
})
