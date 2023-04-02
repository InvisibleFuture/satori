export default defineEventHandler(async event => {

    // 删除评论
    if (event.node.req.method === 'DELETE') {
        const comments = useStorage('comment')
        const comment = await comments.getItem(event.context.params.id)
        if (comment) {
            await comments.removeItem(comment.id) // 删除评论
            return  comment                       // 返回评论
        }
        event.node.res.statusCode = 404
        return { error: '评论不存在' }
    }

})