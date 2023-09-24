import fs from 'fs'
import path from 'path'
import imageSize from 'image-size'

// 如果数据目录不存在则创建
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'))
}

// 如果gallery目录不存在则创建
if (!fs.existsSync(path.join(process.cwd(), 'data/gallery'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data/gallery'))
}

// 如果image目录不存在则创建
if (!fs.existsSync(path.join(process.cwd(), 'data/gallery/image'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data/gallery/image'))
}

export default defineEventHandler(async event => {
    // 处理 GET 请求(读取image中的图片文件列表)
    if (event.node.req.method === 'GET') {
        const dirpath = await fs.promises.readdir(path.join(process.cwd(), 'data/gallery/image'))
        const list = await Promise.all(dirpath.map(async file => {
            const file_path = path.join(process.cwd(), 'data/gallery/image', file)
            const dimensions = imageSize(await fs.promises.readFile(file_path))
            const image = '/api/gallery/' + file
            return { image, ...dimensions }
        }))
        console.log('list:', list)
        return { list }
    }
})
