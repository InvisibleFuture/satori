import fs from 'fs'
import { defineEventHandler } from 'h3'

// 检查 logs 目录是否存在，不存在则创建
if (!fs.existsSync('./data/logs')) {
    fs.mkdirSync('./data/logs', { recursive: true })
}

export default defineEventHandler(async event => {

    // 排除 /api/statistics/http 请求和 /api/log 请求
    if (event.node.req.url === '/api/statistics/http') return
    if (event.node.req.url === '/api/log') return

    // 自动压缩日志文件(超过10M)
    if (fs.existsSync('./data/logs/default.json')) {
        const stats = fs.statSync('./data/logs/default.json')
        if (stats.size > 1024 * 1024 * 10) {
            const date = new Date().toISOString().slice(0, 10)
            fs.renameSync('./data/logs/default.json', `./data/logs/default-${date}.json`)
        }
    }

    // 增量写入JSON格式的日志到本地
    fs.appendFileSync('./data/logs/default.json', JSON.stringify({
        time: new Date().toISOString(),
        method: event.node.req.method,
        url: event.node.req.url,
        originalUrl: event.node.req.originalUrl,
        headers: {
            ...event.node.req.headers,
            cookie: undefined,
            authorization: undefined,
        },
    }) + '\n')
})
