import { db } from '../model'

export default defineEventHandler(async event => {
  const list = []
  
  for (let name of Object.keys(db.models)) {
    let rest = await db.models[name].findAndCountAll()
    list.push({name, count: rest.count})
  }

  return { list }
})
