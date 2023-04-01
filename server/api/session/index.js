// 登录会话管理

import md5 from "md5"
import { v4 } from "uuid"

export default defineEventHandler(async event => {
    const session = useStorage('session')
    const user = useStorage('user')

    // POST 请求(创建会话)
    if (event.node.req.method === 'POST') {
        const { name, password } = await readBody(event)

        // 验证参数
        if (!name || !password) {
            return { message: '用户名或密码不能为空' }
        }

        // 查询用户是否存在(修正版)
        const users = await user.getKeys()
        const list = await Promise.all(users.map(async key => {
            const item = await user.getItem(key)
            item.name = name
            return item
        }))

        console.log(list)
        const u = list.length ? list[0] : null

        if (!u) {
            return { message: '用户不存在' }
        }

        // 验证密码
        if (u.password !== md5(password+u.salt)) {
            console.log(password, u.salt)
            console.log(u.password, md5(u.salt+password))
            return { message: '密码错误' }
        }

        // 保存会话
        const session_value = {
            id: v4(),
            user_id: u.id,
            ip: event.node.req.headers['x-forwarded-for'] || event.node.req.connection.remoteAddress,
            ua: event.node.req.headers['user-agent'],
            created_at: new Date().getTime()
        }
        session.setItem(session_value.id, session_value)

        // 设置 cookie
        event.res.setHeader('Set-Cookie', `session=${session_value.id}; path=/; httpOnly`)

        // 移除密码
        delete u.password
        delete u.salt

        // 返回用户信息
        session_value.user = u
        return session_value
    }

    // GET 请求(获取本用户所有会话)
    if (event.node.req.method === 'GET') {
        // 从 cookie 中获取会话 id (session)
        const sid = event.node.req.headers.cookie?.split(';').find(c => c.trim().startsWith('session=')).split('=')[1]

        // 取出会话(判断是否登录)
        const s = await session.getItem(sid)
        if (!sid || !s) {
            return { message: '未登录' }
        }

        const sessions = await session.getKeys()
        const list = await Promise.all(sessions.map(async key => {
            const item = await session.getItem(key)
            return item.user_id === s.user_id ? item : null
        }))
        return list
    }
})
