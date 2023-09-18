import fs from 'fs'
import readline from 'readline'

export default defineEventHandler(async event => {
    if (event.node.req.method === 'GET') {
        const { method, url, time, day } = getQuery(event)

        // 当天24个小时分别统计访问次数
        const counts = {}

        // 先设置 24 个小时均为 0
        for (let i = 0; i < 24; i++) {
            counts[i] = 0
        }

        // 读取指定日期或当天日志文件(东八区时间, 防止大文件溢出内存)
        const date = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10)
        const filepath = `./data/logs/${day || date}.json`
        if (await fs.promises.access(filepath).then(() => true).catch(() => false)) {
            const rl = readline.createInterface({
                input: fs.createReadStream(filepath),
                crlfDelay: Infinity
            })
            for await (const line of rl) {
                const log = JSON.parse(line)
                if ((!method || log.method === method) && (!url || log.url.indexOf(url) !== -1) && (!time || log.time >= time)) {
                    const time = new Date(log.time).getHours()
                    if (!counts[time]) counts[time] = 0
                    counts[time]++
                }
            }
        }

        return counts
    }
})