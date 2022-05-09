import { db } from '../model'

export default defineEventHandler(async event => {
  if (event.method === 'POST') {
    // create user
  }

  let sid = useCookie(event.req, 'sid') || 0
  let key = 'session:' + sid
  let id  = await useStorage().getItem(key)
  let user = await db.model('user').findOne({where: { id }})
  return user

  //const list = []
  //for (let name of Object.keys(db.models)) {
  //  let rest = await db.models[name].findAndCountAll()
  //  list.push({name, count: rest.count})
  //}
  //return { list }
})
