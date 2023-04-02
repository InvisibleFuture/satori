import fs from 'fs'

export default defineEventHandler(async event => {
    // 如果是 GET 请求, 从本地获取日志(按条件过滤筛选日志
    if (event.node.req.method === 'GET') {
        // 分别统计 GET, POST, PUT, DELETE 请求的次数
        const counts = {
            method: {},
            url: {},
            time: {},
        }
        const { method, url, time } = getQuery(event)
        const data = fs.readFileSync('./data/logs/default.json', 'utf-8')
        const logs = data.split('\n').filter(line => line).map(line => JSON.parse(line)).filter(log => {
            return (!method || log.method === method) && (!url || log.url.indexOf(url) !== -1) && (!time || log.time >= time)
        })
        logs.forEach(log => {
            if (!counts.method[log.method]) counts.method[log.method] = 0
            counts.method[log.method]++;
            if (!counts.url[log.url]) counts.url[log.url] = 0
            counts.url[log.url]++;

            // 时间按小时统计
            log.time = log.time.slice(0, 13) + ':00:00.000Z'
            if (!counts.time[log.time]) counts.time[log.time] = 0
            counts.time[log.time]++;

            // session 取前 8 位(不可公开)
            log.session = log.session?.slice(0, 8)
            if (!counts.session[log.session]) counts.session[log.session] = 0
            counts.session[log.session]++;
        })
        return counts
    }
})
