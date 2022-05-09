import { db } from '../model'
import md5 from 'md5'
import random from 'string-random'

export default defineEventHandler(async event => {

  if (event.req.method === 'GET') {
    // 先解密 cookie 为 sid
    // 使用 sid 查询用户 id
    // 使用用户 id 获取用户信息并返回
    return '获取自己的所有会话列表'
  }

  if (event.req.method === 'POST') {
    const user = await db.model('user').findOne({where: { name: event.req.body.name }})
    if (!user) {
      event.res.statusCode = 400
      return '账户不存在'
    }
    if (user.password !== md5(event.req.body.password + user.salt)) {
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
