export default defineEventHandler(async event => {
  let sid = useCookie(event.req, 'sid')
  if (sid) {
    let id  = await useStorage().getItem('session:' + sid)
    if (id) {
      let userinfo = await db.model('user').findOne({where: { id }})
      if (userinfo) {
        event.req.account = userinfo
      } else {
        console.log('会话仍有效, 但用户已不存在, 注销此会话')
        setCookie(event.res, 'sid', '', {maxAge: -1})
      }
    } else {
      console.log('有cookie却已失效, 注销此 cookie(没有存储对应id)')
      setCookie(event.res, 'sid', '', {maxAge: -1})
    }
  }
})
