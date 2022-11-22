# 先检查 mysql 是否安装
# 创建一个可用 mysql

git pull

chmod 777 start.sh

yarn
yarn build

pm2 delete satori
pm2 start yarn --name satori -- preview
