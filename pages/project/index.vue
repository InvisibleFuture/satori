<template lang="pug">
div.container.mx-auto.mt-42.projects
  h1.text-3xl Project List
  section
    h2 NodeJS
    ul
      li
        a(target="_blank" href="https://github.com/InvisibleFuture/kana")
          h3 Kana
          p express + nedb 300行代码构建完备 RESTful 风格 WEB API 后端服务
      li
        a(target="_blank" href="https://github.com/InvisibleFuture/kana-bbs")
          h3 Kana BBS
            span.bg-green-500.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 vue
          p Kana + Vue 构建轻量论坛
        a(target="_blank" href="https://kana.satori.love")
          button.mr-2 Demo
      li
        h3 Kana Chat
          span.bg-green-500.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 vue
        p Simple + Vue 构建在线聊天室
        a(target="_blank" href="https://kana.satori.love/chat")
          button.mr-2 demo
      li
        a(target="_blank" href="https://github.com/InvisibleFuture/satori")
          h3 Satori Blog
            span.bg-green-500.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 nuxt
          p Nuxt3 + Mysql 构建个人博客
        a(target="_blank" href="https://satori.love")
          button.mr-2 Demo
      li
        a(target="_blank" href="https://www.npmjs.com/package/interrelated")
          h3 interrelated
            span.bg-red-600.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 npm
          p js 数据双向关联
      li
        a(target="_blank" href="https://www.npmjs.com/package/satori-markdown")
          h3 satori-markdown
            span.bg-red-600.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 npm
          p 使用指定 markdown 文件作为 wiki
      li
        a(target="_blank" href="https://www.npmjs.com/package/express-session-nedb")
          h3 express-session-nedb
            span.bg-red-600.text-white.rounded-sm.inline-block.px-2.font-bold.text-xs.mx-2 npm
          p 使用 nedb 作为 session 的存储容器, 且保障nedb与项目使用统一版本依赖, 使 session 数据也可以被查询和管理
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
        a(target="_blank" href="https://github.com/InvisibleFuture/flutterbbs")
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
  section.py-16
    div.bg-pink-500.rounded-xl.p-6.min-h-96
      span.text-9xl.text-white.font-bold.opacity-10 Service type
      div
        button 前端 / 后端 / APP / 脚本 / 订制 / 批量数据处理 / 批量图像处理
      div.flex.items-center.max-w-3xl.p-4.text-center.text-white.font-bold
        div.flex.flex-col.mr-4(class="w-1/3")
          img(:src="wx")
          p WeChat
        div.flex.flex-col.mr-4(class="w-1/3")
          img(:src="qq")
          p QQ
        div.flex.flex-col.mr-4(class="w-1/3")
          img(:src="tg")
          p Telegram
</template>

<script>
import wx from '@/assets/image/wx.jpg'
import qq from '@/assets/image/qq.jpg'
import tg from '@/assets/image/tg.jpg'
export default {
  setup() {
    return { wx, qq, tg }
  },
}
</script>

<style>
.projects section {
  margin: 4rem 0;
}
.projects section h2 {
  color: #EC4899;
  font-weight: bold;
  margin-bottom: 1rem;
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