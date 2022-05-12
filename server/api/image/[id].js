import fs from 'fs'
import { db, User, File } from '../../model'

export default defineEventHandler(async event => {
  let data = await File.findOne({where:{id: event.context.params.id}})
  if (!data) {
    event.res.statusCode = 404
    return '资源不存在'
  }

  if (event.context.params.id.match(new RegExp(/.webp$/))) {
    let file = await new Promise(resolve => {
      fs.readFile(`../data/webp/${event.context.params.id}`, (err, data) => {
        resolve(data)
      })
    })
    return file
  }

  // TODO: image size
  let file = await new Promise(resolve => {
    fs.readFile(data.path, (err, data) => {
      resolve(data)
    })
  })
  // TODO: file type
  return file
})
