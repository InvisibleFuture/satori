import fs from 'fs'
import { defineEventHandler } from 'h3'

// 检查 logs 目录是否存在，不存在则创建
if (!fs.existsSync('./data/logs')) {
    fs.mkdirSync('./data/logs', { recursive: true })
}

export default defineEventHandler(async event => {

    // 排除无需记录的请求
    if (event.node.req.url === '/api/log') return
    if (event.node.req.url === '/api/statistics/http') return
    if (event.node.req.url === '/api/statistics/http/day') return
    if (event.node.req.url === '/api/statistics/http/week') return
    if (event.node.req.url === '/api/statistics/http/month') return

    // 每天一个日志文件
    const date = new Date().toISOString().slice(0, 10)
    const filepath = `./data/logs/${date}.json`
    if (!await fs.promises.exists(filepath)) {
        await fs.promises.writeFile(filepath, '')
    }

    // 增量写入JSON格式的日志到本地
    await fs.promises.appendFile(filepath, JSON.stringify({
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
