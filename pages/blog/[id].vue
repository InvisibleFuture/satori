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
    .flex.flex-col.my-12
      div.flex
        input.bg-gray-100.p-4.outline-none.w-full.border-b.border-dark-500.border-opacity-5(placeholder="昵称", v-model="comment.name" type="text")
        input.bg-gray-100.p-4.outline-none.w-full.border-b.border-dark-500.border-opacity-5(placeholder="邮箱", v-model="comment.email" type="email")
        input.bg-gray-100.p-4.outline-none.w-full.border-b.border-dark-500.border-opacity-5(placeholder="网址", v-model="comment.url" type="text")
      textarea.bg-gray-100.p-4.outline-none.w-full(rows="6" placeholder="评论" v-model="comment.content" @keyup.enter="comment.submit()")
    .flex.my-12(v-for="item in data.comments", :key="item.id")
      img.rounded-full.w-16.h-16.mr-4(:src="'item.user.avatar'")
      div
        .flex.gap-2.pb-2.font-bold
          a(:href="'item.user.url'" target="_blank") {{ item.name }}
          //span.bg-pink-600.text-pink-600.bg-opacity-10.px-2.py-1.rounded-full.text-xs admin
        div {{ item.content }}
        time.text-rose-300.font-bold.text-sm.my-2  {{ rwdate(item.createdAt || item.updatedAt) }}
        div
          button.font-bold.bg-pink-600.px-2.py-1.text-white.rounded-md.text-xs(
            @click="comment.remove(item.id)"
            v-if="account.online"
          ) delete

</template>

<script setup>
const route = useRoute();
const account = useState("account");
const { data, pending } = useFetch(`/api/blog/${route.params.id}`, {
  key: "blog" + route.params.id,
});
const edit = ref({ show: false });

// 评论(发表评论, 删除评论)
const comment = ref({
  item: { name: "", email: "", url: "", content: "" },
  submit: () => {
    $fetch(`/api/blog/${route.params.id}/comments`, {
      method: "POST",
      body: JSON.stringify(comment.value.item),
    }).then((item) => {
      data.value.comments.unshift(item);                       // 添加到评论列表
      comment.value.item.content = "";                         // 清空输入框
      localStorage.setItem("name", comment.value.item.name);   // 本地保存 name
      localStorage.setItem("email", comment.value.item.email); // 本地保存 email
      localStorage.setItem("url", comment.value.item.url);     // 本地保存 url
    });
  },
  remove: (comment_id) => {
    $fetch(`/api/blog/${data.value.id}/comments/${comment_id}`, { method: "DELETE" }).then(item => {
      data.value.comments = data.value.comments.filter(x => x.id !== comment_id);
      console.log('delete', item);
    });
  },
});

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
  }).then((res) => res.json()).then((rest) => {
    data.value.html = rest.html;
    data.value.createdAt = rest.createdAt
    data.value.updatedAt = rest.updatedAt
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
  // 读取本地保存的 name 和 email
  comment.value.name = localStorage.getItem("name");
  comment.value.email = localStorage.getItem("email");
  comment.value.url = localStorage.getItem("url");
});
</script>
