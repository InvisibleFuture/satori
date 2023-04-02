<template lang="pug">
.max-w-3xl.mx-auto.py-42
  div(v-if="pending") Loading..
  article(v-else)
    div(v-if="!edit.show")
      div.markdown(v-html="data.html")
      div.mb-6.flex.gap-4.text-gray-500.text-xs
        time {{ rwdate(data.createdAt) }} 创建
        time(v-if="data.createdAt !== data.updatedAt") {{ rwdate(data.updatedAt) }} 最后更新
    div(v-else)
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

// 转换时间格式
const rwdate = (utc) => {
    let t = new Date(utc);
    return t.getMonth() + 1 + "月 " + t.getDate() + ", " + t.getFullYear();
}

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
