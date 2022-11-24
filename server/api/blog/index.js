import fs from 'fs'
import path from 'path'
import { lexer } from 'marked'

// 读取所有 blog 中的 md 文件, 以此来获取所有的 tag
const findTags = (item) => {
    const list = []
    if (item.type === 'em') list.push(item.text)
    if (item.type === 'strong') list.push(item.text)
    item.tokens?.forEach(token => {
        findTags(token).forEach(tag => list.push(tag))
    });
    return list
}

// 转换时间格式
const rwdate = (utc) => {
    let t = new Date(utc);
    return t.getMonth() + 1 + "月 " + t.getDate() + ", " + t.getFullYear();
}

export default defineEventHandler(async event => {

    // 如果数据目录不存在则创建
    if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data'))
    }

    // 如果blog目录不存在则创建
    if (!fs.existsSync(path.join(process.cwd(), 'data/blog'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data/blog'))
    }

    // 如果markdown目录不存在则创建
    if (!fs.existsSync(path.join(process.cwd(), 'data/blog/markdown'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data/blog/markdown'))
    }

    // 如果image目录不存在则创建
    if (!fs.existsSync(path.join(process.cwd(), 'data/blog/image'))) {
        fs.mkdirSync(path.join(process.cwd(), 'data/blog/image'))
    }

    // 处理 GET 请求(读取markdown中的md文件列表)
    if (event.req.method === 'GET') {
        const dirpath = fs.readdirSync(path.join(process.cwd(), 'data/blog/markdown'))
        const files = dirpath.filter(file => path.extname(file) === '.md')
        const list = files.map(file => {
            const filepath = path.join(process.cwd(), 'data/blog/markdown', file)
            const id = path.basename(file, '.md')                    // 文件名
            const content = fs.readFileSync(filepath, 'utf8')        // 读取文件内容
            const title = content.match(/^# (.*)/m)?.[1] || id       // 提取文件内容中的标题
            const description = content.match(/^> (.*)/m)?.[1] || '' // 提取文件内容中的描述
            const createdAt = fs.statSync(filepath).birthtime        // 提取文件的创建日期
            const updatedAt = fs.statSync(filepath).mtime            // 提取文件的修改日期
            return { id, title, description, createdAt, updatedAt, date: rwdate(createdAt) }
        }).sort((a, b) => b.updatedAt - a.updatedAt)
        const tags = dirpath.map(file => {
            const filepath = path.join(process.cwd(), 'data/blog/markdown', file)
            const content = fs.readFileSync(filepath, 'utf-8');
            return findTags({ tokens: lexer(content) })
        }).flat();
        return { 'name': 'blog', tags, list }
    }

    // 处理 POST 请求, 上传 .md 文件
    if (event.req.method === 'POST') {
        const { id, content } = event.req.body
        const filepath = path.join(process.cwd(), 'data/blog/markdown', `${id}.md`)
        fs.writeFileSync(filepath, content)
        return { 'name': 'blog', data: { id, content } }
    }

    // 处理 PUT 请求, 覆写 .md 文件
    if (event.req.method === 'PUT') {
        const { id, content } = event.req.body
        const filepath = path.join(process.cwd(), 'data/blog/markdown', `${id}.md`)
        fs.writeFileSync(filepath, content)
        return { 'name': 'blog', data: { id, content } }
    }

    // 处理 DELETE 请求, 删除 .md 文件
    if (event.req.method === 'DELETE') {
        const { id } = event.req.body
        const filepath = path.join(process.cwd(), 'data/blog/markdown', `${id}.md`)
        fs.unlinkSync(filepath)
        return { 'name': 'blog', data: { id } }
    }

    // 处理其他请求
    return { 'OTHER': 'OTHER LIST' }

})
