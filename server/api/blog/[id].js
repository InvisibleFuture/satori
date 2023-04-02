import { defineEventHandler, getCookie } from 'h3'
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

// markdown_to_html
const md2html = (content) => {
    const regex = /<code\s+class="(.*)"\s*>([\s\S]*?)<\/code>/g;
    return marked(content, { breaks: true }).replace(regex, (match, p1, p2) => {
        return `<code class="${p1} hljs">${hljs.highlightAuto(he.decode(p2)).value}</code>`
    })
}

export default defineEventHandler(async event => {

    const blog = useStorage('blog')
    const session = useStorage('session')

    // 检查是否有权限操作(不存在ID的允许任意修改)
    const checkPermission = async (blog_uid) => {
        const session_id = getCookie(event, 'session')
        console.log('session_id:', session_id)
        if (!session_id) return false
        const session_data = await session.getItem(session_id)
        console.log('session_data:', session_data)
        if (!session_data) return false
        console.log('blog_uid:', blog_uid)
        return session_data.user_id === blog_uid
    }

    // 处理 GET 请求
    if (event.node.req.method === 'GET') {
        const data = await blog.getItem(event.context.params.id)
        return {
            ...data,
            html: md2html(data.content),
            tags: findTags({ tokens: lexer(data.content) }),
            title: lexer(data.content).find(item => item.type === 'heading' && item.depth === 1),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        }
    }
    
    // 处理 DELETE 请求(检查是否有权限)
    if (event.node.req.method === 'DELETE') {
        const data = await blog.getItem(event.context.params.id)
        if (!(await checkPermission(data.user_id))) {
            event.node.res.statusCode = 403
            return { success: false, message: '没有权限' }
        }
        console.log('DELETE:', event.context.params.id)
        await blog.removeItem(event.context.params.id)
        return { success: true }
    }

    // 处理 PATCH 请求(body 中的数据覆盖原数据)
    if (event.node.req.method === 'PATCH') {
        const data = await blog.getItem(event.context.params.id)
        if (!data) {
            event.node.res.statusCode = 404
            return { success: false, message: '没有找到该博客' }
        }
        if (data.user_id && !await checkPermission(data.user_id)) {
            event.node.res.statusCode = 403
            return { success: false, message: '没有权限' }
        }
        const body = await readBody(event) // 获取 body
        delete body.id                     // 移除禁止修改的字段
        delete body.user_id                // 移除禁止修改的字段
        for (const key in body) {          // 合并数据
            data[key] = body[key]
        }
        data.updatedAt = new Date().toISOString() // 自动修改的字段
        await blog.setItem(event.context.params.id, data)
        return {
            ...data,
            html: md2html(data.content),
            tags: findTags({ tokens: lexer(data.content) }),
            title: lexer(data.content).find(item => item.type === 'heading' && item.depth === 1)
        }
    }

})
