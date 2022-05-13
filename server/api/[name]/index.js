import { db, User, File } from '../../model'

// 获取列表
export default defineEventHandler(async event => {
  // await User.create({name: 'Last', age:11})
  // await useStorage().setItem('test:foo', { hello: 'world' })
  // const aaax = await useStorage().getItem('test:foo')
  // sequelize.models - 实例中已定义的模型
  // sequelize.isDefined() - 检查模型是否定义
  // sequelize.model() - 获取模型

  if (!db.isDefined(event.context.params.name)) {
    event.res.statusCode = 404
    return '类型不存在'
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
    // if (event.context.params.name === 'blog') {
    //   query.include = [{
    //     model: User,
    //     attributes: ['name', 'age'],
    //   }]
    // }
    if (['blog', 'project', 'gallery'].find(item => item === event.context.params.name)) {
      query.include = [{model: User, attributes: ['name', 'age']}]
      if (event.context.params.name === 'gallery') { // 对 gallery 特别附加
        query.include.push({model: File, attributes: ['id','name','type', 'size', 'width', 'height']})
      }
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

    if (['blog', 'project', 'gallery'].find(item => item === event.context.params.name)) {
      if (!event.req.account) {
        event.res.statusCode = 400
        return '必须登录才可以创建此对象'
      }
      event.req.body.userId = event.req.account.id
    }

    // comment 无须登录 (作一些额外处理, 如将头像缓存到本地)
    if (event.context.params.name === 'comment') {
      console.log(event.req.body)
      if (!event.req.body.blogId) {
        event.res.statusCode = 400
        return '必须依附了 blogId 才可以发表'
      }
      if (!event.req.body.name) {
        event.res.statusCode = 400
        return '必须依附了 name 才可以发表'
      }
      if (!event.req.body.mail) {
        event.res.statusCode = 400
        return '必须依附了 email 才可以发表'
      }
      if (!event.req.body.data) {
        event.res.statusCode = 400
        return '必须依附了 data 才可以发表'
      }
    }

    // TODO: 检查危险的属性, 放行管理员
    // TODO: 如果是创建用户, 对用户名检查占用
    // TODO: 如果是创建用户, 对密码作盐处理
    // TODO: 新建即添加 files 等字段
    return await db.model(event.context.params.name).create(event.req.body)
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
