import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
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

export default defineEventHandler(async event => {

    // 对接收到的数据预处理
    if (['POST', 'PATCH', 'PUT'].includes(event.req.method)) {
        if (event.req.headers['content-type'].indexOf('application/json') !== -1) {
            event.context.body = await new Promise(resolve => {
                let data = ''
                event.req.on('data', (chunk) => data += chunk)
                event.req.on('end', () => resolve(JSON.parse(decodeURI(data))))
            })
        }
    }

    // 处理 GET 请求(读取markdown中的md文件)
    if (event.req.method === 'GET') {
        const { id } = event.context.params
        const decodeId = decodeURIComponent(id)                  // url中文解码
        const filepath = path.join(process.cwd(), 'data/blog/markdown', `${decodeId}.md`)
        const content = fs.readFileSync(filepath, 'utf8')        // 读取文件内容
        const title = content.match(/^# (.*)/m)?.[1] || id       // 提取文件内容中的标题
        const description = content.match(/^> (.*)/m)?.[1] || '' // 提取文件内容中的描述
        const createdAt = fs.statSync(filepath).birthtime        // 提取文件的创建日期
        const updatedAt = fs.statSync(filepath).mtime            // 提取文件的修改日期
        var html = marked(content, { breaks: true })             // 渲染为html
        html.match(/<code class="(.*)">([\s\S]*?)<\/code>/g)?.forEach(code => {
            const className = code.match(/<code class="(.*)">/)[1]                              // 正则提取code标签中的class
            const language = className.replace(/language-/, '')                                 // 则去除class中的 language-bash 字符串
            const codeContent = code.replace(/<code class="(.*)">/, '').replace(/<\/code>/, '') // 提取code标签中的内容(去除头尾标签)
            const highlighted = hljs.highlight(unescapeHTML(codeContent), { language }).value   // 代码高亮
            html = html.replace(code, `<code class="${className} hljs">${highlighted}</code>`)  // 逐一替换
        })
        return { id, title, description, createdAt, updatedAt, content, html, date: rwdate(createdAt) }
    }

    // 处理 PATCH 请求, 修改 .md 文件
    if (event.req.method === 'PATCH') {
        const id = event.context.params.id                       // id
        const decodeId = decodeURIComponent(id)                  // url中文解码
        const { content, createdAt, updatedAt } = event.context.body
        const filepath = path.join(process.cwd(), 'data/blog/markdown', `${decodeId}.md`)
        var html = marked(content, { breaks: true })             // 渲染为html
        html.match(/<code class="(.*)">([\s\S]*?)<\/code>/g)?.forEach(code => {
            const className = code.match(/<code class="(.*)">/)[1]                              // 正则提取code标签中的class
            const language = className.replace(/language-/, '')                                 // 则去除class中的 language-bash 字符串
            const codeContent = code.replace(/<code class="(.*)">/, '').replace(/<\/code>/, '') // 提取code标签中的内容(去除头尾标签)
            const highlighted = hljs.highlight(unescapeHTML(codeContent), { language }).value   // 代码高亮
            html = html.replace(code, `<code class="${className} hljs">${highlighted}</code>`)  // 逐一替换
        })
        if (updatedAt) fs.utimesSync(filepath, new Date(), new Date(updatedAt))
        if (content) fs.writeFileSync(filepath, content, 'utf8')
        return { id, content, html }
    }

})
