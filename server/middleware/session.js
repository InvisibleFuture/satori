import { db } from '../model.js'
export default defineEventHandler(async event => {
  // TODO: 为不必验证的对象跳过验证
  let sid = useCookie(event.req, 'sid')
  if (sid) {
    let id  = await useStorage().getItem('session:' + sid)
    if (id) {
      let userinfo = await db.model('user').findOne({where: { id }})
      if (userinfo) {
        event.req.account = userinfo
      } else {
        // 会话仍有效, 但用户已不存在, 注销此会话
        setCookie(event.res, 'sid', '', {maxAge: -1})
      }
    } else {
      // 有cookie却已失效, 注销此 cookie(没有存储对应id)
      setCookie(event.res, 'sid', '', {maxAge: -1})
    }
  }
})
