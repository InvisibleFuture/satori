import fs from 'fs';
import { lexer } from 'marked';

export default defineEventHandler(async event => {

    // 处理 GET 请求
    if (event.node.req.method === 'GET') {
        // 读取所有 blog 中的 md 文件, 以此来获取所有的 tag
        const loadtags = (item) => {
            const list = [];
            if (item.type === 'em') list.push(item.text);
            if (item.type === 'strong') list.push(item.text);
            item.tokens?.forEach(token => {
                loadtags(token).forEach(tag => list.push(tag));
            });
            return list;
        }
        const tags = fs.readdirSync('data/blog/markdown').map(file => {
            const content = fs.readFileSync(`data/blog/markdown/${file}`, 'utf-8');
            return loadtags({ tokens: lexer(content) })
        });
        return tags.flat();
    }

})
