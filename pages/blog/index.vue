<template lang="pug">
.container.mx-auto.py-32.flex
  main.flex-1.px-12
    div(v-if="pending") Loading...
    .flex.flex-col.gap-6(v-else)
      ul.list-decimal
        template(v-for="(item, index) in data.list", :key="item.id")
          li
            NuxtLink.flex.px-1(:to="`/blog/${item.id}`")
              span.font-bold.flex-1 {{ item.title }}
              span.text-sm.text-gray-400 {{ item.date }}
  aside.w-md.py-2.flex.flex-col.gap-8(class="<sm:hidden")
    .tags(v-if="!pending")
      span.font-bold # TAG
      ul.flex.flex-wrap.gap-2.py-2
        li.px-2.rounded-md.cursor-pointer.transition-all.duration-300(
          class="hover:text-pink-500 hover:bg-gray-400 hover:bg-opacity-10",
          v-for="item in data.tags",
          :key="item"
        ) {{ item }}
    //div
    //  span.font-bold # 归档
    //  ul
    //    li(v-for="index in 12") 2022 12 title
</template>

<script setup>
const { data, pending } = useFetch("/api/blog");

//const tags = [
//  { name: "Ubuntu" },
//  { name: "Caddy" },
//  { name: "JavaScript" },
//  { name: "Stable Diffusion" },
//  { name: "Dreambooth" },
//];
</script>

<style>
/**
ul.blog-list {
  list-style-type: none;
  counter-reset: sectioncounter;
}
ul.blog-list li {
  position: relative;
}

ul.blog-list li::before {
  position: absolute; left: -1.5rem;
  text-align: right;
  background: #ccc;
  content: counter(sectioncounter) "";
  counter-increment: sectioncounter;
}
**/
</style>
