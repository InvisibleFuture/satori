import fs from 'fs'

export default defineEventHandler(async event => {
    // 如果是 GET 请求, 从本地获取日志(按条件过滤筛选日志
    if (event.node.req.method === 'GET') {
        const { method, url, time } = getQuery(event)
        const counts = { time: {} }
        const logs = []
        const files = fs.readdirSync('./data/logs')
        files.forEach(file => {
            const data = fs.readFileSync(`./data/logs/${file}`, 'utf-8')
            const rest = data.split('\n').filter(line => line).map(line => JSON.parse(line)).filter(log => {
                return (!method || log.method === method) && (!url || log.url.indexOf(url) !== -1) && (!time || log.time >= time)
            })
            logs.push(...rest)
        })

        // 先将所有日志按小时统计次数
        logs.forEach(log => {
            const date = new Date(log.time)
            date.setHours(date.getHours() + 8) // 转换为东八区时间
            const time = date.toISOString().slice(0, 13) + ':00:00.000Z'
            if (!counts.time[time]) counts.time[time] = 0
            counts.time[time]++
        })

        // 将缺失的时间补全
        const times = Object.keys(counts.time)
        const start = new Date(times[0])
        const end = new Date(times[times.length - 1])
        while (start <= end) {
            const time = start.toISOString()
            if (!counts.time[time]) counts.time[time] = 0
            start.setHours(start.getHours() + 1)
        }

        // 按每天一组拆分数据
        const days = {}
        Object.keys(counts.time).forEach(time => {
            const day = time.slice(0, 10)
            if (!days[day]) days[day] = []
            days[day].push({time, count: counts.time[time]})
        })

        // 按照 time 字段排序
        Object.keys(days).forEach(day => {
            days[day].sort((a, b) =>  new Date(a.time) - new Date(b.time))
        })

        return {...counts, days}
    }
})
