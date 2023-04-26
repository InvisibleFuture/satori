#!/bin/sh

# 服務器地址
SERVER="ubuntu@118.193.62.78"

# 编译静态资源(到相对於腳本的目录)
cd $(dirname $0)
npm run build

# Nuxt BUG : 正則替換 .output/server/nitro/nodde-server.mjs 中的 "/home/satori/satori/data/blog" 爲 "./data/blog", 以及 user, session, comment
sed -i 's/\/home\/satori\/satori\/data\/\(blog\|user\|session\|comment\)/\.\/data\/\1/g' .output/server/chunks/nitro/node-server.mjs


# 向服务器上传文件(打包上传以提高上传效率)
cd .output
zip -9r satori.zip ./*
scp -r satori.zip $SERVER:~/satori.zip
cd ../
rm -rf .output

# 解压文件, 判斷 pm2 中是否存在 satori 進程, 如果存在則重啟, 否則啟動
ssh $SERVER """
    unzip -o -d ~/satori satori.zip;
    cd ~/satori;
    if pm2 list | grep satori; then
        pm2 reload satori;
    else
        pm2 start node --name satori -- ./server/index.mjs;
    fi
    """
