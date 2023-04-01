export default defineEventHandler(async event => {

    //// 必须要身份验证的请求类型
    //if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.node.req.method)) {
    //    if (event.node.req.headers.cookie) {
    //        const cookie = event.node.req.headers.cookie
    //        const session_id = cookie.split(';').find(x=>x.trim().startsWith('session='))?.split('=')[1]
    //        if (session_id) event.context.session = await useStorage('session').getItem(session_id)
    //    }
    //    if (!event.context.session) {
    //        event.node.res.statusCode = 401
    //        return { message: '必须要登录才能操作' }
    //    }
    //}
    //// 明确存在目标对象的请求类型
    //if (['GET', 'PUT', 'PATCH', 'DELETE'].includes(event.node.req.method)) {
    //    const { name, id } = event.context.params
    //    if ( name && id ) {
    //        const item = await useStorage(name).getItem(id)
    //        if (item) event.context.item = item
    //    }
    //}
    //// 需要验证权限的请求类型
    //if (['PUT', 'PATCH', 'DELETE'].includes(event.node.req.method)) {
    //    if (event.context.session.user_id !== event.context.item.user_id) {
    //        event.node.res.statusCode = 403
    //        return { message: '没有权限操作' }
    //    }
    //}

})
