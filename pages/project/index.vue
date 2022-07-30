<template lang="pug">
div.container.mx-auto.mt-42.projects
  h1.text-3xl Project List
  section
    h2 NodeJS
    ul
      li
        h3 Kana
        p express + nedb 构建轻量后端服务
        button.mr-2 demo
        button.mr-2 source code
      li
        h3 Kana BBS
        p Kana + Vue 构建轻量论坛
        button.mr-2 demo
        button.mr-2 source code
      li
        h3 Satori Blog
        p Nuxt3 + Mysql 构建个人博客
        button.mr-2 demo
        button.mr-2 source code
      li
        h3 Simple
        p express + nedb 300 行代码实现完备后端服务
        button.mr-2 demo
        button.mr-2 source code
      li
        h3 Simple Chat
        p Simple + Vue 构建在线聊天室
        button.mr-2 demo
        button.mr-2 source code
      li
        h3 satori-markdown.js
        p marked 构建 markdown 文档服务
        button.mr-2 demo
        button.mr-2 source code
  section
    h2 Go
    ul
      li
        h3 mmm
        p 使用 levledb 构建通用后端服务
  section
    h2 Python
    ul
      li
        h3 Image Search
        p 图片特征反向搜索
      li
        h3 Image Download
        p 图片批量采集
  section
    h2 Dart / Flutter
    ul
      li
        h3 Flutter BBS
        p 使用 Flutter 构建多端论坛 APP
      li
        h3 Flutter Shop
        p 使用 Flutter 构建多端商店 APP
  section
    h2 Bash
    ul
      li
        h3 Todo
        p Linux 控制台中的任务管理
  section
    p Service type
    button 约稿 / 订制 / 委托
</template>

<style>
.projects section {
  margin: 4rem 0;
}
.projects section h2 {
  color: red;
  font-weight: bold;
}
.projects section h2::before {
  content: '# ';
  font-weight: bold;
}
.projects section ul li {
  margin-bottom: 2rem;
}
.projects section ul li h3 {
  font-weight: bold;
}
</style>