import fs from 'fs'
import { getQuery } from 'h3'

export default defineEventHandler(async event => {

    // 如果是 GET 请求, 从本地获取日志(按条件过滤筛选日志
    if (event.node.req.method === 'GET') {
        const { method, url, time } = getQuery(event)
        const data = fs.readFileSync('./data/logs/default.json', 'utf-8')
        const logs = data.split('\n').filter(line => line).map(line => JSON.parse(line)).filter(log => {
            return (!method || log.method === method) && (!url || log.url.indexOf(url) !== -1) && (!time || log.time >= time)
        })
        return logs
    }

})
