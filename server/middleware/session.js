import { db, Session } from '../model.js'

// 先初始化 session (设定session时入库)
Session.findAll().then(list => {
  list.forEach(({id:sid, userId:id}) => {
    const key = 'session:' + sid
    useStorage().setItem(key, id)
    console.log(key, id)
  })
})

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
