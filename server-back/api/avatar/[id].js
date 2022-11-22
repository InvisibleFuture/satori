import { readFile } from 'fs'

export default defineEventHandler(async event => {
  let file = await new Promise(resolve => {
    readFile('../data/avatar/'+event.context.params.id, (err, data) => {
      resolve(data)
    })
  })
  return file
})
