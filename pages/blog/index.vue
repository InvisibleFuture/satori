<template lang="pug">
.container.mx-auto.py-32.flex
  main.flex-1.px-12
    div(v-if="pending") Loading...
    div.flex.flex-col.gap-6(v-else)
      ul.list-decimal.flex.flex-col.gap-8
        li(v-for="(item, index) in data", :key="item.id")
          NuxtLink.flex.flex-col.px-1(:to="`/blog/${item.id}`")
            span.font-bold.flex-1 {{ item.title || item.content }}
            span.text-sm.text-gray-400 {{ rwdate(item.createdAt) }}
  aside.w-md.py-2.flex.flex-col.gap-8(class="<sm:hidden")
    .tags(v-if="!pending")
      span.font-bold # TAG
      ul.flex.flex-wrap.gap-2.py-2
        li.px-2.rounded-md.cursor-pointer.transition-all.duration-300(
          class="hover:text-pink-500 hover:bg-gray-400 hover:bg-opacity-10",
          v-for="item in data.tags",
          :key="item"
        ) {{ item }}
</template>

<script setup>
const { data, pending } = useFetch("/api/blog");
const rwdate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
};
</script>
