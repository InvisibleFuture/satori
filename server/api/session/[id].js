export default defineEventHandler(async event => {
    const session = useStorage('session')

    // DELETE 请求(注销指定会话)
    if (event.req.method === 'DELETE') {

        // 获取当前会话
        const cookie = event.req.headers.cookie
        const session_id = cookie ? cookie.split(';').find(item => item.trim().startsWith('session=')).split('=')[1] : null
        const session_ea = session_id ? await session.getItem(session_id) : {}

        // 获取指定会话
        const session_ex = await session.getItem(event.context.params.id)

        // 如果当前会话不存在, 则要求登录(401)
        if (!session_ea) {
            event.res.statusCode = 401
            return { message: '请先登录' }
        }

        // 如果指定会话不存在, 则提示无效(404)
        if (!session_ex) {
            event.res.statusCode = 404
            return { message: '无效的会话' }
        }

        // 如果当前会话不属于当前用户, 则提示无权限(403)
        if (session_ea.user_id !== session_ex.user_id) {
            event.res.statusCode = 403
            return { message: '无权限' }
        }

        // 如果被注销的会话是当前会话, 则移除 cookie
        if (session_id === event.context.params.id) {
            event.res.setHeader('Set-Cookie', `session=; path=/; httpOnly`)
        }

        // 删除指定的会话
        await session.removeItem(event.context.params.id)

        // 返回成功
        return { message: '注销成功' }
    }

    // GET 请求(获取指定会话)
    if (event.req.method === 'GET') {

        // 获取当前会话
        const cookie = event.req.headers.cookie
        const session_id = cookie ? cookie.split(';').find(item => item.trim().startsWith('session=')).split('=')[1] : null
        const session_ea = session_id ? await session.getItem(session_id) : {}

        // 获取指定会话
        const session_ex = await session.getItem(event.context.params.id)

        // 如果当前会话不存在, 则要求登录(401)
        if (!session_ea) {
            event.res.statusCode = 401
            return { message: '请先登录' }
        }

        // 如果指定会话不存在, 则提示无效(404)
        if (!session_ex) {
            event.res.statusCode = 404
            return { message: '无效的会话' }
        }

        // 如果当前会话不属于当前用户, 则提示无权限(403)
        if (session_ea.user_id !== session_ex.user_id) {
            event.res.statusCode = 403
            return { message: '无权限' }
        }

        // 返回指定会话
        return session_ex
    }
})
