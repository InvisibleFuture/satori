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

            // 按请求方法统计
            if (!counts.method[log.method]) counts.method[log.method] = 0
            counts.method[log.method]++;

            // 按请求路径统计
            if (!counts.url[log.url]) counts.url[log.url] = 0
            counts.url[log.url]++;

            // 按请求时间统计
            //log.time = log.time.slice(0, 13) + ':00:00.000Z'
            //if (!counts.time[log.time]) counts.time[log.time] = 0
            //counts.time[log.time]++;

            // 按请求时间统计, 重写修正(每小时, 如果缺少某个小时的数据, 会导致图表显示不连续, 可以补充数据为0)
            log.time = log.time.slice(0, 13) + ':00:00.000Z'
            if (!counts.time[log.time]) counts.time[log.time] = 0
            counts.time[log.time]++;
            const times = Object.keys(counts.time).sort()
            for (let i = 0; i < times.length - 1; i++) {
                const time1 = new Date(times[i])
                const time2 = new Date(times[i + 1])
                if (time2 - time1 > 3600000) {
                    const time = new Date(time1.getTime() + 3600000).toISOString()
                    counts.time[time] = 0
                }
            }

            // session 取前 8 位(不可公开)
            //log.session = log.session?.slice(0, 8)
            //if (!counts.session[log.session]) counts.session[log.session] = 0
            //counts.session[log.session]++;
        })
        return counts
    }
})
