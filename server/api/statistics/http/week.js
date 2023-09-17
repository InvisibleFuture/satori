import fs from 'fs'
import readline from 'readline'

export default defineEventHandler(async event => {
    if (event.node.req.method === 'GET') {
        const { method, url, time, week:x } = getQuery(event)

        // 本周7天分别统计访问次数
        const counts = {}

        // 回溯时间(周)
        const w = x ? parseInt(x) * 24 * 60 * 60 * 1000 : 0
        console.log(w)

        // 读取指定周或本周所有日志文件(防止大文件溢出内存)
        const files = await fs.promises.readdir('./data/logs')
        await Promise.all(files.filter(file => {
            const date = new Date(Date.now() + 8 * 60 * 60 * 1000 - w )
            console.log(date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const week = date.getDay()
            const weekStart = new Date(year, month - 1, day - week + 1).getTime()
            const weekEnd = new Date(year, month - 1, day + 7 - week).getTime()
            const dateStr = file.match(/(\d{4}-\d{2}-\d{2})\.json$/)[1]
            const timestamp = new Date(dateStr).getTime()
            return timestamp >= weekStart && timestamp <= weekEnd
        }).map(async file => {
            const filepath = `./data/logs/${file}`
            const rl = readline.createInterface({
                input: fs.createReadStream(filepath),
                crlfDelay: Infinity
            })
            for await (const line of rl) {
                const log = JSON.parse(line)
                if ((!method || log.method === method) && (!url || log.url.indexOf(url) !== -1) && (!time || log.time >= time)) {
                    const date = new Date(log.time)
                    date.setHours(date.getHours() + 8) // 转换为东八区时间
                    const time = date.toISOString().slice(0, 10)
                    if (!counts[time]) counts[time] = 0
                    counts[time]++
                }
            }
        }))

        return counts
    }
})
