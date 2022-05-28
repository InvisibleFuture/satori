import { db, Session } from '../model'
import md5 from 'md5'
import random from 'string-random'

export default defineEventHandler(async event => {

  if (event.req.method === 'GET') {
    if (!event.req.account) {
      event.res.statusCode = 400
      return '尚未登录'
    }
    return '获取自己的所有会话列表, 功能尚未实现'
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
    const setSession = async function(id) {
      const sid = random(32)
      const key = 'session:' + sid
      if (await useStorage().getItem(key)) {
        return await setSession(id)
      }
      useStorage().setItem(key, id)
      Session.create({id: sid, userId: id})
      setCookie(event.res, 'sid', sid)
    }
    setSession(user.id) // 发放不重复的 sid

    return user
  }
  
  return '未支持的操作方法'
})
