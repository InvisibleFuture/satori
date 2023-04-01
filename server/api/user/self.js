export default defineEventHandler(async event => {
    const user = useStorage('user')
    const session = useStorage('session')
    const cookie = event.node.req.headers.cookie

    // 获取当前会话
    const session_id = cookie ? cookie.split(';').find(item => item.trim().startsWith('session=')).split('=')[1] : null
    const session_value = session_id ? await session.getItem(session_id) : null

    //// 如果当前会话不存在, 则要求登录(401)
    //if (!session_value) {
    //    event.res.statusCode = 401
    //    return { message: '请先登录' }
    //}

    // 如果当前会话不存在, 则返回默认游客用户
    if (!session_value) {
        return {
            id: 'guest',
            name: '游客',
            sid: '',
            online: false,
        }
    }

    // 获取当前用户
    const user_id = session_value ? session_value.user_id : null
    const user_value = user_id ? await user.getItem(user_id) : null

    //// 如果当前用户不存在, 注销掉此会话, 要求登录(401)
    //if (!user_value) {
    //    await session.removeItem(session_id)
    //    event.res.statusCode = 401
    //    return { message: '请先登录' }
    //}

    // 如果当前用户不存在, 则返回默认游客用户
    if (!user_value) {
        return {
            id: 'guest',
            name: '游客',
            sid: '',
            online: false,
        }
    }

    // 移除密码
    delete user_value.password
    delete user_value.salt
    
    // 标记前会话的 sid
    user_value.sid = session_id
    user_value.online = true

    // 返回当前用户
    return user_value
})
