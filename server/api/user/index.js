import md5 from 'md5'
import { v4 } from 'uuid'

export default defineEventHandler(async event => {
    const user = useStorage('user')

    // 处理 POST 请求(创建用户)
    if (event.req.method === 'POST') {
        const body = await readBody(event)
        const { name, password } = body

        if (!name || name.length < 2 || name.length > 32) {
            return { 'error': '用户名长度不符合要求' }
        }

        if (!password || password.length < 6 || password.length > 32) {
            return { 'error': '密码长度不符合要求' }
        }

        // 检查用户名是否已存在
        const isExist = await user.getKeys().then(keys=>{
            return Promise.all(keys.map(key => {
                return user.getItem(key).then(data => data.name === name)
            })).then(res => res.some(item => item))
        })

        if (isExist) {
            return { 'error': '用户名已存在' }
        }

        // 密码加密(slat 随机32位字符串)
        const slat = v4()
        const data = {
            id: v4(),
            name,
            slat,
            password: md5(password + slat),
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        await user.setItem(data.id, data)
        return data
    }

    // 处理 GET 请求(读取用户列表)
    if (event.req.method === 'GET') {
        return user.getKeys().then(keys => {
            return Promise.all(keys.map(key => {
                return user.getItem(key).then(data => {
                    delete data.password
                    delete data.slat
                    return data
                })
            }))
        })
    }

    return { 'OTHER': 'OTHER LIST' }

})