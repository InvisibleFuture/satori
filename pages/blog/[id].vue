<template lang="pug">
.container.mx-auto.pt-42
  div(v-if="pending") Loading..
  article(v-else)
    div
      h1.font-bold {{ data.title }}
      p.text-sm.text-gray-600 {{ data.createdAt }}
    .content(v-html="data.content")
</template>

<script setup>
import "highlight.js/styles/agate.css";
const route = useRoute();
const { data, pending } = useFetch(`/api/blog/${route.params.id}`, {
  key: "blog" + route.params.id,
});
</script>

<style>
.content pre code {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 14px;
}

.content table {
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ddd;
  margin: 1rem 0;
}
.content table tr th {
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
}
.content table tr td {
  border: 0px solid #ddd;
  padding: 0.5rem;
}
</style>