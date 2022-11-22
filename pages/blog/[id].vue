<template lang="pug">
.max-w-3xl.mx-auto.py-42
  div(v-if="pending") Loading..
  article(v-else)
    .content(v-html="data.content")
    div.text-center
      img.mx-auto.rounded-full(:src="avatar")
      p --- satori ---
      p.text-gray-600 {{ data.date }} Last
</template>

<script setup>
import avatar from '@/assets/image/avatar.jpeg'
import "highlight.js/styles/agate.css";
const route = useRoute();
const { data, pending } = useFetch(`/api/blog/${route.params.id}`, {
  key: "blog" + route.params.id,
});
</script>

<style>
.content h1 {
  font-weight: bold;
  font-size: 2rem;
  margin: 1.5rem 0;
}

.content pre code {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 14px;
}

.content table {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 1rem 0;
}
.content table tr th {
  padding: 0.5rem;
}
.content table tr td {
  padding: 0.5rem;
}
.content p {
  margin: 2rem 0;
  word-wrap: break-word;
  word-break:break-all;
}
.content input[type=checkbox] {
  position: relative;
  margin-right: .3em;
}
.content input[type=checkbox]::before {
  position: absolute;
  content: "\a0";
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: .3em;
  background-color: #ececec;
  text-indent: .15em;
  line-height: .65;
}
.content input[type="checkbox"]:checked::before {
    content: "\2713";
    color: #00aeec;
    background-color: #dff6fd;
}
</style>