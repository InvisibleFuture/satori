import { defineEventHandler } from 'h3'
import { v4 } from 'uuid'

export default defineEventHandler(async event => {

    const blog = useStorage('blog')
    const data = await blog.getItem(event.context.params.id)

    if (!data) {
        event.node.res.statusCode = 404
        return { success: false, message: '没有找到该博客' }
    }

    // 发表 BLOG 的评论
    if (event.node.req.method === 'POST') {
        const body = await readBody(event)
        if (!body.content || !body.name || !body.email) {
            event.node.res.statusCode = 400
            return { success: false, message: '参数错误' }
        }
        const comment = { ...body, id: v4(), createdAt: new Date().toISOString() }
        await blog.setItem(data.id, { ...data, comments: [comment, ...(data.comments || [])] })
        return comment
    }

})
