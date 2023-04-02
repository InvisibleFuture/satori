<template lang="pug">
.blog-item.max-w-3xl.mx-auto.py-42
  div(v-if="pending") Loading..
  article(v-else)
    .content(v-if="!edit.show", v-html="data.html")
    .content(v-else)
      textarea.w-full.h-screen.p-8.outline-none.caret-light-blue-700(
        v-model="data.content",
        @keyup.ctrl.enter="editSubmit"
      )
    .text-center
      img.mx-auto.rounded-full.w-64.h-64(src="/avatar.jpeg")
      p --- satori ---
      p.text-gray-600 {{ data.date }} Last
    .flex.my-12
      textarea.bg-gray-100.p-4.outline-none.w-full(rows="6")
    .flex.my-12(v-for="item in comments.list", :key="item.id")
      img.rounded-full.w-16.h-16.mr-4(:src="item.avatar")
      div
        .flex.gap-2.pb-2.font-bold
          span {{ item.name }}
          //span.bg-pink-600.text-pink-600.bg-opacity-10.px-2.py-1.rounded-full.text-xs admin
        div {{ item.content }}
        .text-rose-300.font-bold.text-sm.my-2
          span {{ item.date }}
        //div
        //  button.font-bold.bg-pink-600.px-2.py-1.text-white.rounded-md.text-xs(
        //    @click="comment_remove(item.id)"
        //    v-if="account.online"
        //  ) delete
</template>

<script setup>
const route = useRoute();
const { data, pending } = useFetch(`/api/blog/${route.params.id}`, {
  key: "blog" + route.params.id,
});
const edit = ref({ show: false });

const comments = {
  list: [
    {
      id: "1",
      name: "桜華",
      avatar: "/avatar.jpeg",
      content: "hahaha",
      date: "11月 24, 2022",
    },
    {
      id: "2",
      name: "桜華",
      avatar: "/avatar.jpeg",
      content: "hahaha",
      date: "11月 24, 2022",
    },
    {
      id: "3",
      name: "桜華",
      avatar: "/avatar.jpeg",
      content: "hahaha",
      date: "11月 24, 2022",
    },
  ],
};

// 进入编辑模式
const editData = () => {
  edit.value.show = !edit.value.show;
};

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
    // 取消编辑
    if (e.code === "Escape") {
      edit.value.show = false;
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