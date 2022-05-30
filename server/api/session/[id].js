import { db, Session } from '@/server/model.js'
import random from 'string-random'

export default defineEventHandler(async event => {

  if (event.req.method === 'GET') {
    if (!event.req.account) {
      event.res.statusCode = 400
      return '尚未登录'
    }
    return '获取自己的所有会话列表, 功能尚未实现'
  }

  if (event.req.method === 'DELETE') {
    if (!event.req.account) {
      event.res.statusCode = 400
      return '尚未登录'
    }
    // 移除磁盘记录
    // 移除缓存记录
    // 磁盘与缓存应一体化
    // 查看记录时按照频率自动实现缓存
    // 缓存退出机制(秒)
    // 那如何设定关系
    // 都用全自动缓存了自然也要用leveldb
    return '注销指定会话, 只能是自己的'
  }

  //if (event.req.method === 'POST') {
  //  const user = await db.model('user').findOne({where: { name: event.req.body.name }})
  //  if (!user) {
  //    event.res.statusCode = 400
  //    return '账户不存在'
  //  }
  //  if (user.password !== md5(event.req.body.password + user.salt)) {
  //    event.res.statusCode = 400
  //    return '密码不匹配'
  //  }
  //  const setSession = async function(id) {
  //    const sid = random(32)
  //    const key = 'session:' + sid
  //    if (await useStorage().getItem(key)) {
  //      return await setSession(id)
  //    }
  //    useStorage().setItem(key, id)
  //    Session.create({id: sid, userId: id})
  //    setCookie(event.res, 'sid', sid)
  //  }
  //  setSession(user.id) // 发放不重复的 sid
  //  return user
  //}
  return '未支持的操作方法'
})
