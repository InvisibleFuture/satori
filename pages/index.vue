<template lang="pug">
.container.mx-auto.pt-32
  // 统计(访问量, 文章数, 评论数, 活跃状态)
  //.bg-red-400.text-white.text-center.py-4
  //  span.text-2xl.font-bold {{ total }}
  //  span.text-lg ml-2 个
  // 五术
  div
    div(v-for="item in 五术", :key="item.title")
      //h2.text-2xl.font-bold(v-if="item.list") {{ item.title }}
      div.whitespace-pre.p-8(v-for="x in item.list", :key="x.content")
        div {{ x.content }}
        div.flex.flex-col.gap-2
          div.px-8(v-for="reply in x.reply", :key="reply.content")
            div.flex.gap-2
              img.h-8.w-8.rounded-full.object-cover(:src="reply.avatar" :alt="reply.name")
              div
                p {{ reply.content }}
                div.flex.gap-2.text-gray-500.text-xs
                  span {{ reply.name }}
                  span 2021-08-08 12:12:12
          div.px-8.text-green-500(v-if="x.reply") 展开12个讨论..
  // 标签 TAG
  //.grid.grid-cols-2.gap-12
  //  .bg-white.rounded-lg.shadow-lg.p-8(v-for="item in items")
  //    h2.text-2xl.font-bold.text-center {{ item.title }}
  //    p.text-center {{ item.content }}
</template>

<script setup>
const 五术 = [
  {
    title: "山",
    content: "content1",
    list: [
      {
        content: `
          天材地宝培生，见识信息元素比率与供量
          蕴养则生，不养则败
          人以育人且如此，人以育物不外是
          且论灌注以培元育己
          生息而不朽，能焉？
          不朽分内外，分神形，谓内神外形，内固其元，外聚其本
          不朽以外相对而不朽，无外则无义
          外治其道，内治其神，其鸿浩无匹
        `,
        reply: [
          {
            content: `hahah`,
            name: `hana`,
            avatar: `https://avatars.githubusercontent.com/u/12621342?v=4`,
          }
        ]
      },
      {
        content: `
          天材地宝培生，见识信息元素比率与供量
          蕴养则生，不养则败
          人以育人且如此，人以育物不外是
          且论灌注以培元育己
          生息而不朽，能焉？
          不朽分内外，分神形，谓内神外形，内固其元，外聚其本
          不朽以外相对而不朽，无外则无义
          外治其道，内治其神，其鸿浩无匹
        `,
      },
    ],
  },
  {
    title: "医",
    content: "content2",
  },
  {
    title: "命",
    content: "content3",
    list: [
      {
        content: `
          醉后不知天在水, 满船清梦压星河
        `,
        date: '5月 12, 2022 Last',
      }
    ]
  },
  {
    title: "卜",
    content: "content4",
  },
  {
    title: "相",
    content: "content5",
  },
];

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
