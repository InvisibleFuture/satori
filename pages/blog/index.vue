<template lang="pug">
.container.mx-auto.py-32.flex
  main.flex-1
    div(v-if="pending") Loading...
    .flex.flex-col.gap-6(v-else)
      div(v-for="(item, index) in data.list", :key="item.id")
        .font-bold
          NuxtLink(:to="`/blog/${item.id}`") {{ item.title }}
        div
          span.text-sm.text-gray-600 {{ item.createdAt }}
  aside.w-64.py-2.flex.flex-col.gap-8(class="<sm:hidden")
    .tags
      span.font-bold # TAG
      ul.flex.flex-wrap.gap-2.py-2
        li.px-2.rounded-md.cursor-pointer.transition-all.duration-300(
          class="hover:text-pink-500 hover:bg-gray-400 hover:bg-opacity-10"
          v-for="item in tags",
          :key="item.name"
        ) {{ item.name }}
    //div
    //  span.font-bold # 归档
    //  ul
    //    li(v-for="index in 12") 2022 12 title
</template>

<script setup>
const { data, pending } = useFetch("/api/blog");
const tags = [
  { name: "Ubuntu" },
  { name: "Caddy" },
  { name: "JavaScript" },
  { name: "Stable Diffusion" },
  { name: "Dreambooth" },
];
</script>
