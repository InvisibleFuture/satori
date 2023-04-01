import fs from 'fs'
import path from 'path'
import webp from 'webp-converter'
//import resize from 'resize-img'

export default defineEventHandler(async event => {

    // 检查 webp 文件夹是否存在, 不存在则创建
    const webpDir = path.join(process.cwd(), 'data/blog/webp')
    if (!fs.existsSync(webpDir)) fs.mkdirSync(webpDir)

    // 处理 GET 请求
    if (event.node.req.method === 'GET') {
        const { id } = event.context.params

        // 请求文件后缀是否 .webp 格式
        if (id.match(/\.webp$/)) {
            const filepath = path.join(process.cwd(), 'data/blog/webp', id)
            // 如果文件不存在则创建
            if (!fs.existsSync(filepath)) {
                const filename = id.replace(/\.webp$/, '')
                const origin = path.join(process.cwd(), 'data/blog/image', filename)
                await webp.cwebp(origin, filepath)
            }
            return fs.readFileSync(filepath)
        }

        // 请求原图
        const filepath = path.join(process.cwd(), 'data/blog/image', `${id}`)
        if (!fs.existsSync(filepath)) return { error: 'file not found' }
        return fs.readFileSync(filepath)

        // 有无缩略图(请求参数中有width和height)
        //if (width && height) {
        //    //const width = parseInt(event.node.req.query.width)
        //    //const height = parseInt(event.node.req.query.height)
        //    //const thumbpath = path.join(process.cwd(), 'data/thumb', `${id}-${width}x${height}.webp`)
        //    //if (fs.existsSync(thumb[...])) {
        //    //    return fs.readFileSync(thumb[...])
        //    //} else {
        //    //    const img = resize(fs.readFileSync(filepath), { width, height })
        //    //    const webp = webp.buffer(img)
        //    //    fs.writeFileSync(thumbpath, webp)
        //    //    return webp
        //    //}
    }

})
