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

# pm2 start npm --name satori -- run preview
