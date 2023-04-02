import crypto from 'crypto'

import { v4 } from 'uuid'
import { marked } from 'marked';
import { defineEventHandler, getCookie, getQuery } from 'h3'
export default defineEventHandler(async event => {

    // 提供一个简单的评论列表, 通过筛选取得指定文章的评论
    if (event.node.req.method === 'GET') {
        const { blog_id } = getQuery(event)
        console.log('GET blog_id', blog_id)
        return useStorage('comment').getKeys().then(keys => {
            return Promise.all(keys.map(key => {
                return useStorage('comment').getItem(key).then(data => {
                    data.createdAt = new Date(data.createdAt) // 将时间戳转换为 UTC 时间
                    data.updatedAt = new Date(data.updatedAt) // 将时间戳转换为 UTC 时间
                    data.user = {
                        avatar: '/avatar.jpeg',
                        email: data.email,
                        url: data.url,
                        name: data.name
                    }
                    return data
                })
            }))
        }).then(list => list.sort((a, b) => b.updatedAt - a.updatedAt)).then(data => {
            if (!blog_id) return data
            return data.filter(item => item.blog_id === blog_id)
        })
    }

    // 发布评论, 允许匿名评论, 必须要填写邮箱
    if (event.node.req.method === 'POST') {
        const { blog_id, content, email, name, url } = await readBody(event)
        if (!blog_id || !content || !email || !name) return { error: '参数错误' }
        const id = v4()
        const createdAt = Date.now()
        const updatedAt = Date.now()
        const data = { id, blog_id, content, name, email, createdAt, updatedAt, url }
        await useStorage('comment').setItem(id, data)
        data.html = marked(data.content, { breaks: true })
        const regex = /<code\s+class="(.*)"\s*>([\s\S]*?)<\/code>/g;
        data.html = data.html.replace(regex, (match, p1, p2) => {
            const html = hljs.highlightAuto(he.decode(p2)).value
            return `<code class="${p1} hljs">${html}</code>`
        })
        data.createdAt = new Date(data.createdAt) // 将时间戳转换为 UTC 时间
        data.updatedAt = new Date(data.updatedAt) // 将时间戳转换为 UTC 时间
        data.user = { avatar: '/avatar.jpeg', email: data.email }
        return data
    }
})
