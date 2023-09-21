import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {

    const blog = useStorage('blog')
    const data = await blog.getItem(event.context.params.id)

    if (!data) {
        event.node.res.statusCode = 404
        return { success: false, message: '没有找到该博客' }
    }

    // 删除 BLOG 的评论
    if (event.node.req.method === 'DELETE') {
        const comment_id = event.context.params.comment_id
        const comments = (data.comments || []).filter(item => item.id !== comment_id)
        await blog.setItem(data.id, { ...data, comments })
        return { success: true }
    }

})
