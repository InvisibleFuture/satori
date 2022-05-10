export default defineEventHandler(async event => {
  if (event.req.method === 'POST' || event.req.method === 'PATCH' || event.req.method === 'PUT') {
    if (event.req.headers['content-type'].indexOf('application/json') != -1) {
      event.req.body = await new Promise(resolve => {
        let data = ''
        event.req.on('data', (chunk) => data += chunk)
        event.req.on('end', () => resolve(JSON.parse(decodeURI(data))))
      })
    }
    // else if (event.req.headers['content-type'].indexOf('multipart/form-data') != -1) {
    //  // 向指定目标的指定字段上传图像, 不同字段对图像接收后的处理方式不同
    //  event.req.files = await new Promise(resolve  => {
    //    formidable({
    //      multiples: true,
    //      uploadDir: 'data/file',
    //      keepExtensions: true,
    //      maxFieldsSize: 200 * 1024 * 1024
    //    }).parse(event.req, function (err, fields, files) {
    //      let list = []
    //      for (let key in files) {
    //        (Array.isArray(files[key]) ? files[key] : [files[key]]).map(item => {
    //          let ipx = {
    //            name: item.originalFilename,
    //            size: item.size,
    //            path: item.filepath,
    //            type: item.mimetype,
    //          }
    //          if (event.context.params.name === 'blog') {
    //            ipx.blogId = event.context.params.id
    //          }
    //          //if (event.context.params.name === '') {}
    //          list.push(ipx)
    //        })
    //      }
    //      db.model('file').bulkCreate(list, { returning:true }).then(result => {
    //        resolve(result)
    //      })
    //    })
    //  })
    //}
  }
})
