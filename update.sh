#!/bin/sh

# 编译静态资源(到相对目录)
cd $(dirname $0)
npm run build

# 打包上传以提高上传效率
zip -r .output.zip ./.output/*

# 向服务器上传文件
scp -r .output.zip root@satori.love:~/docs/

# 解压文件
ssh root@satori.love "cd ~/satori; unzip -o -d ~/satori .output.zip; pm2 reload satori; rm .output.zip;"
rm .output.zip

## 在这之前, 应确保服务器上已经安装了对应版本的 nodejs
## 以及使用 pm2 启动了名为 satori 的服务
## 确保端口配置不会冲突
# pm2 start node --name docs -- .output/server/index.mjs

# build 时为服务更换默认端口
# NITRO_PORT or PORT (defaults to 3000)
# NITRO_HOST or HOST (defaults to '0.0.0.0')
# node .output/server/index.mjs
