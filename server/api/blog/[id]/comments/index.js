import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async event => {

    const blog = useStorage('blog')

    // 发表 BLOG 的评论
    if (event.node.req.method === 'POST') {
        const data = await blog.getItem(event.context.params.id)
        if (!data) {
            event.node.res.statusCode = 404
            return { success: false, message: '没有找到该博客' }
        }
        const { id, user_id, comments, updatedAt, createdAt, ...body } = await readBody(event)
        await blog.setItem(event.context.params.id, {
            ...data,
            comments: [
                ...(data.comments || []),
                {
                    ...body,
                    createdAt: new Date().toISOString(),
                }
            ]
        })
    }

})
