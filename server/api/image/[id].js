import fs from 'fs'
import webp from 'webp-converter'
import resize from 'resize-img'
import { db, User, File } from '../../model'

export default defineEventHandler(async event => {
  let data = await File.findOne({where:{id: event.context.params.id}})
  if (!data) {
    event.res.statusCode = 404
    return '资源不存在'
  }

  if (event.context.params.id.match(new RegExp(/.webp$/))) {
    let path = `../data/webp/${event.context.params.id}`
    if (!fs.existsSync(path)) {
      let img = await resize(fs.readFileSync(data.path), { width: 480 })
      fs.writeFileSync(path, img)
      await webp.cwebp(path, path)
    }
    return fs.readFileSync(path)
  }

  return fs.readFileSync(data.path)
})
