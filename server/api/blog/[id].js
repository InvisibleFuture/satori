import { marked, lexer } from 'marked'
import hljs from "highlight.js"

// 转换编码格式
const unescapeHTML = str => str.replace(/&amp;|&lt;|&gt;|&#39;|&quot;/g, tag => ({
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&#39;': "'", '&quot;': '"'
}[tag] || tag));

// 转换时间格式
const rwdate = (utc) => {
    let t = new Date(utc);
    return t.getMonth() + 1 + "月 " + t.getDate() + ", " + t.getFullYear();
}

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

// 转换 markdown 为 html
const md2html = (md) => {
    return marked(md, { breaks: true }).match(/<code class="(.*)">([\s\S]*?)<\/code>/g)?.forEach(code => {
        const className = code.match(/<code class="(.*)">/)[1]                              // 正则提取code标签中的class
        const language = className.replace(/language-/, '')                                 // 则去除class中的 language-bash 字符串
        const codeContent = code.replace(/<code class="(.*)">/, '').replace(/<\/code>/, '') // 提取code标签中的内容(去除头尾标签)
        const highlighted = hljs.highlight(unescapeHTML(codeContent), { language }).value   // 代码高亮
        return md.replace(code, `<code class="${className} hljs">${highlighted}</code>`)
    })
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

    // 获取当前目标数据
    const blogData = await blog.getItem(event.context.params.id)

    // 处理 GET 请求
    if (event.req.method === 'GET') {
        return {
            ...blogData,
            date: rwdate(blogData.updatedAt),
            html: md2html(blogData.content),
            tags: findTags({ tokens: lexer(blogData.content)})
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
