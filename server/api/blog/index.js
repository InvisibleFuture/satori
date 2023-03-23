import { v4 } from 'uuid'
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

    const blog = useStorage('blog')

    // 处理 POST 请求, 写入 markdown
    if (event.req.method === 'POST') {
        const { content } = await readBody(event)
        const date = Date.now()
        const data = { id: v4(), content, createdAt:date, updatedAt:date }
        await blog.setItem(data.id, data)
        return data
    }

    // 处理 GET 请求(读取 markdown 中的 md 文件列表)
    if (event.req.method === 'GET') {
        return blog.getKeys().then(keys => {
            return Promise.all(keys.map(key => {
                return blog.getItem(key).then(data => {
                    return (typeof data === 'string') || data
                })
            }))
        })
        //.sort((a, b) => b.updatedAt - a.updatedAt)
    }

    //    const tags = dirpath.map(file => {
    //        const filepath = path.join(process.cwd(), 'data/blog/markdown', file)
    //        const content = fs.readFileSync(filepath, 'utf-8');
    //        return findTags({ tokens: lexer(content) })
    //    }).flat();
    //    return { 'name': 'blog', tags, list }

    // 处理其他请求
    return { 'OTHER': 'OTHER LIST' }

})
