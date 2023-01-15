import fs from 'fs'
import path from 'path'

// 如果数据目录不存在则创建
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'))
}

// 如果blog目录不存在则创建
if (!fs.existsSync(path.join(process.cwd(), 'data/statistics'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data/statistics'))
}

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

    // 获取当前域名
    const host = event.req.headers.host

    // 今天的时间戳
    const today = new Date().setHours(0, 0, 0, 0)
    console.log(today)

    // 三个月前的时间戳
    const month = new Date().setMonth(new Date().getMonth() - 3)
    console.log(month)

    // 获取一个月内的日志(时间戳ts)
    const monthLogs = lines.filter(line => {
        return line !== '' && JSON.parse(line).ts * 1000 > month
    })
    //console.log(monthLogs)

    // 获取等级为info的日志
    const infoLogs = monthLogs.filter(line => {
        return JSON.parse(line).level === 'info'
    })
    console.log(infoLogs)

    // 获取 logger 的日志
    const loggerLogs = infoLogs.filter(line => {
        return !['tls', 'tls.cache', 'tls.renew', 'tls.obtain', 'tls.issuance.acme', 'tls.issuance.acme.acme_client', 'tls.cache.maintenance', 'admin', 'admin.api'].includes(JSON.parse(line).logger)
    })
    console.log('loggerLogs')
    console.log(loggerLogs)

    // 获取 satori-blog 的日志
    const satoriLogs = infoLogs.filter(line => {
        return JSON.parse(line).request.host === 'satori.love' //host
    })
    

    return {
        name: host,
        count,
        data: [],
    }
})
