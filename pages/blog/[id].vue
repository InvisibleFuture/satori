<template lang="pug">
.blog-item.max-w-3xl.mx-auto.py-42
  div(v-if="pending") Loading..
  article(v-else)
    // button.rounded-full(@click="editData") editData
    .content(v-if="!edit.show", v-html="data.html")
    .content(v-else)
      textarea.w-full.h-screen.p-8.outline-none.caret-light-blue-700(
        ref="textarea",
        v-model="data.content",
        @keyup.ctrl.enter="editSubmit"
      )
    .text-center
      img.mx-auto.rounded-full(src="/avatar.jpeg")
      p --- satori ---
      p.text-gray-600 {{ data.date }} Last
</template>

<script setup>
import "highlight.js/styles/agate.css";

const route = useRoute();
const { data, pending } = useFetch(`/api/blog/${route.params.id}`, {
  key: "blog" + route.params.id,
});
const textarea = ref(null);
const edit = ref({ show: false });

// 进入编辑模式
//const editData = () => {
//  edit.value.show = !edit.value.show;
//  //textarea.value.addEventListener("input", (e) => {
//  //  textarea.value.style.height = "100px";
//  //  textarea.value.style.height = e.target.scrollHeight + "px";
//  //});
//};

// 提交编辑的内容
const editSubmit = () => {
  fetch(`/api/blog/${route.params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: data.value.content }),
  })
    .then((res) => res.json())
    .then((rest) => {
      data.value.html = rest.html;
      edit.value.show = !edit.value.show;
    });
};

onMounted(() => {
  document.onkeydown = (e) => {
    if (e.repeat) {
      return;
    }
    if (e.code === "KeyI" && e.ctrlKey === true) {
      edit.value.show = !edit.value.show;
    }
  };
});
</script>

<style>
.blog-item .content h1 {
  font-weight: bold;
  font-size: 2rem;
  margin: 1.5rem 0;
}

.blog-item .content pre code {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 14px;
}

.blog-item .content table {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 1rem 0;
}
.blog-item .content table tr th {
  padding: 0.5rem;
}
.blog-item .content table tr td {
  padding: 0.5rem;
}
.blog-item .content p {
  margin: 2rem 0;
  word-wrap: break-word;
  word-break: break-all;
}
.blog-item .content input[type="checkbox"] {
  position: relative;
  margin-right: 0.3em;
}
.blog-item .content input[type="checkbox"]::before {
  position: absolute;
  content: "\a0";
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: 0.3em;
  background-color: #ececec;
  text-indent: 0.15em;
  line-height: 0.65;
}
.blog-item .content input[type="checkbox"]:checked::before {
  content: "\2713";
  color: #00aeec;
  background-color: #dff6fd;
}
</style>