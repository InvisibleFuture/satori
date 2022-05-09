export default defineEventHandler(async event => {
  console.log('middleware body')
  if (event.req.method === 'POST' || event.req.method === 'PATCH' || event.req.method === 'PUT') {
    event.req.body = await new Promise(resolve => {
      let data = ''
      event.req.on('data', (chunk) => data += chunk)
      event.req.on('end', () => resolve(decodeURI(data)))
    })
    console.log(event.req.body)
  }
})
