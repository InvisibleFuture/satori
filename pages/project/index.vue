<template lang="pug">
div.container.mx-auto.mt-42.projects
  h1.text-3xl Project List
  section
    h2 NodeJS
    ul
      li
        h3 Kana
        p express + nedb 300行代码构建完备 RESTful 风格 WEB API 后端服务
        a(target="_blank" href="https://github.com/InvisibleFuture/kana")
          button.mr-2 source code
      li
        h3 Kana BBS
          span.bg-green-500.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 vue
        p Kana + Vue 构建轻量论坛
        a(target="_blank" href="https://github.com/InvisibleFuture/kana-bbs")
          button.mr-2 source code
        a(target="_blank" href="https://kana.satori.love")
          button.mr-2 Demo
      li
        h3 Satori Blog
          span.bg-green-500.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 nuxt
        p Nuxt3 + Mysql 构建个人博客
        a(target="_blank" href="https://github.com/InvisibleFuture/satori")
          button.mr-2 source code
        a(target="_blank" href="https://satori.love")
          button.mr-2 Demo
      li
        h3 Simple
        p express + nedb 300 行代码实现完备后端服务
        button.mr-2 source code
      li
        h3 Simple Chat
          span.bg-green-500.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 vue
        p Simple + Vue 构建在线聊天室
        button.mr-2 source code
        button.mr-2 demo
      li
        h3 satori-markdown.js
          span.bg-red-600.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 npm
        p marked 构建 markdown 文档服务
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
    h2 Dart
    ul
      li
        h3 Flutter BBS
          span.bg-blue-600.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 Flutter
        p 使用 Flutter 构建多端论坛 APP
      li
        h3 Flutter Shop
          span.bg-blue-600.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 Flutter
        p 使用 Flutter 构建多端商店 APP
  section
    h2 Bash
    ul
      li
        a(target="_blank" href="https://github.com/InvisibleFuture/todo")
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