import { defineEventHandler, getCookie } from 'h3'
import { v4 } from 'uuid'
import { lexer, marked } from 'marked';
import hljs from 'highlight.js';
import he from 'he';

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

export default defineEventHandler(async event => {

    const session = useStorage('session')
    const blog = useStorage('blog')

    // 处理 GET 请求(读取 markdown 中的 md 文件列表)
    if (event.node.req.method === 'GET') {
        return await blog.getKeys().then(keys => {
            return Promise.all(keys.map(key => {
                return blog.getItem(key).then(data => {
                    if (typeof data === 'string') return null
                    data.html = marked(data.content, { breaks: true }) // 转换为 html
                    const regex = /<code\s+class="(.*)"\s*>([\s\S]*?)<\/code>/g;
                    data.html = data.html.replace(regex, (match, p1, p2) => {
                        const html = hljs.highlightAuto(he.decode(p2)).value
                        return `<code class="${p1} hljs">${html}</code>`
                    })
                    // 提取标题
                    const tokens = lexer(data.content)
                    const title = tokens.find(item => item.type === 'heading' && item.depth === 1)
                    data.title = title ? title.text : ''
                    // 提取标签
                    data.tags = []
                    tokens.forEach(token => {
                        findTags(token).forEach(tag => data.tags.push(tag))
                    })
                    // 将时间戳转换为 UTC 时间
                    data.createdAt = new Date(data.createdAt)
                    data.updatedAt = new Date(data.updatedAt)
                    return data
                })
            }))
        }).then(list => list.sort((a, b) => b.createdAt - a.createdAt))
    }

    // 处理 POST 请求, 写入 markdown
    if (event.node.req.method === 'POST') {
        const session_id = getCookie(event, 'session')
        if (!session_id) {
            event.node.res.statusCode = 401
            return { success: false, message: '需要登录' }
        }
        const { user_id } = await session.getItem(session_id) || {}
        if (!user_id) {
            event.node.res.statusCode = 401
            return { success: false, message: '没有权限' }
        }
        const { content } = await readBody(event)
        if (!content) {
            event.node.res.statusCode = 400
            return { success: false, message: '内容不可为空' }
        }
        const date = Date.now()
        const data = { id: v4(), content, createdAt:date, updatedAt:date, user_id }
        await blog.setItem(data.id, data)
        data.html = marked(data.content, { breaks: true })
        const regex = /<code\s+class="(.*)"\s*>([\s\S]*?)<\/code>/g;
        data.html = data.html.replace(regex, (match, p1, p2) => {
            const html = hljs.highlightAuto(he.decode(p2)).value
            return `<code class="${p1} hljs">${html}</code>`
        })
        // 提取标题
        const tokens = lexer(data.content)
        const title = tokens.find(item => item.type === 'heading' && item.depth === 1)
        data.title = title ? title.text : ''
        // 提取标签
        data.tags = []
        tokens.forEach(token => {
            findTags(token).forEach(tag => data.tags.push(tag))
        })
        // 将时间戳转换为 UTC 时间
        data.createdAt = new Date(data.createdAt)
        data.updatedAt = new Date(data.updatedAt)
        return data
    }

    // 处理其他请求
    return { 'OTHER': 'OTHER LIST' }

})
