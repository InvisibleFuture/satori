import fs from 'fs'

// 基本的统计功能
// 1. 日志总数
// 2. 文章总数
// 3. 评论总数
// 4. 留言总数
// 5. 访问总数
// 6. 点赞总数
// 7. 收藏总数
// 8. 关注总数
// 9. 粉丝总数

// 统计功能
// 1. 今日/昨日/本周/上周/本月/上月/本年/上年/总数
// 2. 阅览量/点赞量/收藏量/评论量/留言量/访问量/关注量/粉丝量
// 3. 按照时间段统计
// 4. 按照分类统计

export default defineEventHandler(async event => {
    // 直接读取caddy日志文件(json格式的)
    const logPath = '/var/log/caddy/default.log'
    const log = fs.readFileSync(logPath)
    const lines = log.toString().split('\n')
    const count = lines.length

    // 今天的时间戳
    const today = new Date().setHours(0, 0, 0, 0)
    console.log(today)

    // 过滤日志(时间戳ts)
    const Logs = lines.filter(line => {
        if (line === '') return false
        const data = JSON.parse(line)
        if (data.request === undefined) return false
        if (data.request.host !== 'git.satori.love') return false
        return true
    })

    // 统计 User-Agent 的数量
    const userAgent = {}
    Logs.forEach(line => {
        const data = JSON.parse(line)
        const ua = data.request.headers['User-Agent']
        if (userAgent[ua] === undefined) {
            userAgent[ua] = 1
        } else {
            userAgent[ua]++
        }
    })

    // 按照数量排序(并展示数量)
    const userAgentSort = Object.keys(userAgent).sort((a, b) => {
        return userAgent[b] - userAgent[a]
    })

    // 打印出来每项的数量
    userAgentSort.forEach(ua => {
        console.log(`${ua} : ${userAgent[ua]}`)
    })




//    // 三个月前的时间戳
//    const month = new Date().setMonth(new Date().getMonth() - 0)
//    //console.log(month)
//
//    // 获取一个月内的日志(时间戳ts)
//    const monthLogs = lines.filter(line => {
//        return line !== '' && JSON.parse(line).ts * 1000 > month
//    })
//    //console.log(monthLogs)
//
//    // 获取等级为info的日志
//    const infoLogs = monthLogs.filter(line => {
//        return true //JSON.parse(line).level !== 'info'
//    })
//    //console.log(infoLogs)
//
//    // 获取 logger 的日志
//    const loggerLogs = infoLogs.filter(line => {
//        return !['tls', 'tls.cache', 'tls.renew', 'tls.obtain', 'tls.issuance.acme', 'tls.issuance.acme.acme_client', 'tls.cache.maintenance', 'tls.handshake', 'tls.stdlib', 'admin', 'admin.api', 'http.stdlib', 'http.handlers.reverse_proxy', 'events', 'http.handlers.file_server'].includes(JSON.parse(line).logger)
//    })
//
//    // 过滤出 msg 为 'http request' 的日志
//    const requestLogs = loggerLogs.filter(line => {
//        return JSON.parse(line).msg !== 'http request'
//    })
//
//    // 获取 satori-blog 的日志
//    const host =  'satori.love' // event.node.req.headers.host
//    const satoriLogs = requestLogs.filter(line => {
//        if (JSON.parse(line).request === undefined) {
//            //console.log(JSON.parse(line))
//            return false
//        }
//        return JSON.parse(line).request.host === host
//    })
    
    const host =  'satori.love' // event.node.req.headers.host
    return {
        name: host,
        count,
        data: [],
    }
})
