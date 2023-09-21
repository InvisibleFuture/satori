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
        const comment = { id: v4(), createdAt: new Date().toISOString(), ...body }
        await blog.setItem(data.id, { comments: [comment, ...(data.comments || [])], ...data })
        return comment
    }

})
