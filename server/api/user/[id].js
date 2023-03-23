export default defineEventHandler(async event => {
    const user = useStorage('user')

    if (event.req.method === 'GET') {
        return await user.getItem(event.context.params.id)
    }

    const body = await readBody()

    if (event.req.method === 'PUT') {
        return await user.setItem(event.context.params.id, event.context.body)
    }

    if (event.req.method === 'PATCH') {
        const data = await user.getItem(event.context.params.id)
        for (const key in event.context.body) {
            data[key] = event.context.body[key]
        }
        return await user.setItem(event.context.params.id, data)
    }
})
