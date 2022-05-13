import fs from 'fs'

export default defineEventHandler(async event => {
  let file = await new Promise(resolve => {
    fs.readFile('../data/avatar/'+event.context.params.id, (err, data) => {
      resolve(data)
    })
  })
  return file
})
