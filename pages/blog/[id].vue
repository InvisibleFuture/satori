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
      textarea.bg-gray-100.p-4.outline-none.w-full(rows="6" placeholder="评论" v-model="comment.content" @keyup.enter="comment_submit")
    .flex.my-12(v-for="item in comments", :key="item.id")
      img.rounded-full.w-16.h-16.mr-4(:src="item.user.avatar")
      div
        .flex.gap-2.pb-2.font-bold
          a(:href="item.user.url" target="_blank") {{ item.name }}
          //span.bg-pink-600.text-pink-600.bg-opacity-10.px-2.py-1.rounded-full.text-xs admin
        div {{ item.content }}
        time.text-rose-300.font-bold.text-sm.my-2  {{ rwdate(item.updatedAt) }}
        div
          button.font-bold.bg-pink-600.px-2.py-1.text-white.rounded-md.text-xs(
            @click="comment_remove(item.id)"
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

const { data: comments, pending: comments_pending } = useFetch(`/api/comment?blog_id=${route.params.id}`, {
  key: "comment" + route.params.id,
});

const comment = ref({ name:"", email:"", url:"", content: "", blog_id: route.params.id });
const comment_submit = () => {
  fetch("/api/comment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment.value),
  }).then((res) => res.json()).then(item => {
    console.log('create', item);
    comments.value.unshift(item)
    comment.value.content = "";
    // 本地保存 name 和 email
    localStorage.setItem("name", comment.value.name);
    localStorage.setItem("email", comment.value.email);
    localStorage.setItem("url", comment.value.url);
  });
};

const comment_remove = (id) => {
  fetch(`/api/comment/${id}`, {
    method: "DELETE",
  }).then((res) => res.json()).then(item => {
    console.log('delete', item);
    comments.value = comments.value.filter(item => item.id !== id);
  });
};

//const comments = {
//  list: [
//    {
//      id: "1",
//      name: "桜華",
//      avatar: "/avatar.jpeg",
//      content: "hahaha",
//      date: "11月 24, 2022",
//    },
//    {
//      id: "2",
//      name: "桜華",
//      avatar: "/avatar.jpeg",
//      content: "hahaha",
//      date: "11月 24, 2022",
//    },
//    {
//      id: "3",
//      name: "桜華",
//      avatar: "/avatar.jpeg",
//      content: "hahaha",
//      date: "11月 24, 2022",
//    },
//  ],
//};

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
  // 读取本地保存的 name 和 email
  comment.value.name = localStorage.getItem("name");
  comment.value.email = localStorage.getItem("email");
  comment.value.url = localStorage.getItem("url");
});
</script>
