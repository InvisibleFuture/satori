import fs from 'fs'
import { defineEventHandler, getCookie } from 'h3'

// 检查 logs 目录是否存在，不存在则创建
if (!fs.existsSync('./data/logs')) {
    fs.mkdirSync('./data/logs')
}

export default defineEventHandler(async event => {

    console.log('log', event.node.req.method, event.node.req.url)

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
