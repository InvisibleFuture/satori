import { marked, lexer } from 'marked'
import hljs from "highlight.js"
import he from 'he';

// 获取所有的 tag
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

    const blog = useStorage('blog')
    const session = useStorage('session')

    // 检查是否有权限操作
    const checkPermission = async (blog_uid) => {
        const cookie = event.req.headers.cookie
        const session_id = cookie ? cookie.split(';').find(item => item.trim().startsWith('session=')).split('=')[1] : null
        const sessionData = session_id ? await session.getItem(session_id) : {}
        return (sessionData.uid !== uid)
    }

    // 处理 GET 请求
    if (event.req.method === 'GET') {
        const data = await blog.getItem(event.context.params.id)
        const regex = /<code\s+class="(.*)"\s*>([\s\S]*?)<\/code>/g;
        return {
            ...data,
            html: marked(data.content, { breaks: true }).replace(regex, (match, p1, p2) => {
                return `<code class="${p1} hljs">${hljs.highlightAuto(he.decode(p2)).value}</code>`
            }),
            tags: findTags({ tokens: lexer(data.content) }),
            title: lexer(data.content).find(item => item.type === 'heading' && item.depth === 1),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }
    }

    // 检查是否有权限操作
    if (await checkPermission(blogData.uid)) {
        event.res.statusCode = 403
        return { success: false, message: '没有权限' }
    }
    
    // 处理 DELETE 请求(检查是否有权限)
    if (event.req.method === 'DELETE') {
        console.log('DELETE:', event.context.params.id)
        await blog.removeItem(event.context.params.id)
        return { success: true }
    }

    // 获取 body
    const body = await readBody()

    // 处理 PUT 请求
    if (event.req.method === 'PUT') {
        return await blog.setItem(event.context.params.id, {
            ...body,
            updatedAt: new Date().toISOString(),
            html: md2html(body.content)
        })
    }

    // 处理 PATCH 请求(body 中的数据覆盖原数据)
    if (event.req.method === 'PATCH') {
        const data = await blog.getItem(event.context.params.id)
        for (const key in body) {
            data[key] = body[key]
        }
        return await blog.setItem(event.context.params.id, {
            ...data,
            updatedAt: new Date().toISOString(),
            html: md2html(data.content)
        })
    }

})
