import { db } from '../model'

export default defineEventHandler(async event => {
  // await useStorage().setItem('test:foo', { hello: 'world' })
  // const aaax = await useStorage().getItem('test:foo')
  // sequelize.models - 实例中已定义的模型
  // sequelize.isDefined() - 检查模型是否定义
  // sequelize.model() - 获取模型

  const list = []

  for (let name of Object.keys(db.models)) {
    let rest = await db.models[name].findAndCountAll()
    list.push({name, count: rest.count})
  }

  return { list }
})
