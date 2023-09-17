import fs from 'fs'
import readline from 'readline'

export default defineEventHandler(async event => {
    if (event.node.req.method === 'GET') {
        const { method, url, time } = getQuery(event)

        // 当天24个小时分别统计访问次数
        const counts = { time: {} }

        // 异步读取日志文件(防止大文件溢出内存)
        const files = await fs.promises.readdir('./data/logs')
        console.log('files', files)
        files.forEach(file => {
            const rl = readline.createInterface({
                input: fs.createReadStream(`./data/logs/${file}`),
                crlfDelay: Infinity
            })
            rl.on('line', line => {
                const log = JSON.parse(line)
                if ((!method || log.method === method) && (!url || log.url.indexOf(url) !== -1) && (!time || log.time >= time)) {
                    const date = new Date(log.time)
                    date.setHours(date.getHours() + 8) // 转换为东八区时间
                    const time = date.toISOString().slice(0, 13) + ':00:00.000Z'
                    if (!counts.time[time]) counts.time[time] = 0
                    counts.time[time]++
                }
            })
            rl.on('close', () => {
                console.log('readline close')
            })
        })

        return counts
    }
})