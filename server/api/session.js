import { db } from '../model'
import md5 from 'md5'
import random from 'string-random'

export default defineEventHandler(async event => {
  // await useStorage().setItem('test:foo', { hello: 'world' })
  // const aaax = await useStorage().getItem('test:foo')
  // console.log(aaax)
  // sequelize.models - 实例中已定义的模型
  // sequelize.isDefined() - 检查模型是否定义
  // sequelize.model() - 获取模型

  // 接收数据
  const body = function() {
    return new Promise(resolve => {
      let data = ''
      event.req.on('data', (chunk) => data += chunk)
      event.req.on('end', () => resolve(decodeURI(data)))
    })
  }

  if (event.req.method === 'GET') {
    // 先解密 cookie 为 sid
    // 使用 sid 查询用户 id
    // 使用用户 id 获取用户信息并返回
    return '获取自己的所有会话列表'
  }

  if (event.req.method === 'POST') {
    let data = JSON.parse(await body())
    const user = await db.model('user').findOne({where: { name: data.name }})
    if (!user) {
      event.res.statusCode = 400
      return '账户不存在'
    }
    if (user.password !== md5(data.password + user.salt)) {
      event.res.statusCode = 400
      return '密码不匹配'
    }

    // 发放不重复的 sid
    const setSession = async function(id) {
      const sid = random(32)
      const key = 'session:' + sid
      if (await useStorage().getItem(key)) {
        return await setSession(id)
      }
      await useStorage().setItem(key, id)
      setCookie(event.res, 'sid', sid)
    }

    setSession(user.id)

    //let counter = useCookie(event.req, 'counter') || 0
    //setCookie(event.res, 'counter', ++counter)
    //return { counter }
    return user
  }


  //const list = []
  //for (let name of Object.keys(db.models)) {
  //  let rest = await db.models[name].findAndCountAll()
  //  list.push({name, count: rest.count})
  //}
  //return { list }
  return '未支持的操作方法'
})
