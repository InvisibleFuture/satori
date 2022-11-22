<template lang="pug">
.container.mx-auto.py-24.flex.flex-col
  div(v-if="pending") Loading...
  div.flex.flex-col.gap-6(v-else)
    div(v-for="(item, index) in data.list", :key="item.id")
      div.font-bold
        NuxtLink(:to="`/blog/${item.id}`") {{ item.title }}
      div
        span.text-sm.text-gray-600 {{ item.createdAt }}
</template>

<script setup>
const { data, pending } = useFetch("/api/blog");
</script>
