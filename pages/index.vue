<template lang="pug">
.container.mx-auto.pt-32
  // 统计(访问量, 文章数, 评论数, 活跃状态)
  div.bg-red-400.text-white.text-center.py-4
    span.text-2xl.font-bold {{ total }}
    span.text-lg ml-2 个
  // 标签 TAG
  .grid.grid-cols-2.gap-12
    div.bg-white.rounded-lg.shadow-lg.p-8(v-for="item in items")
      h2.text-2xl.font-bold.text-center {{ item.title }}
      p.text-center {{ item.content }}
</template>

<script setup>
const items = [
  {
    title: "炼丹",
    content: "content1",
  },
  {
    title: "笔记",
    content: "content2",
  },
  {
    title: "AI",
    content: "content3",
  },
  {
    title: "ACG",
    content: "content4",
  },
  {
    title: "统计",
    content: "content5",
  },
  {
    title: "CADDY",
    content: "content6",
  },
];
</script>
