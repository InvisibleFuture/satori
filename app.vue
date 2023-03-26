<template lang="pug">
.min-h-screen.bg-white.text-gray-800
  header.header.absolute.left-0.top-0.right-0.border-gray-100.transition-all.duration-150(
    :class="{ 'border-b-1': route.path !== '/' && route.path !== '/account/signin' }"
  )
    nav.container.mx-auto.flex.text-gray-400.text-lg.font-bold
      template(v-for="item in navItems")
        NuxtLink.px-4.py-6.transition-all.duration-150(
          class="hover:text-gray-800",
          :class="{ 'text-black': route.path === item.path }",
          :to="item.path"
        ) {{ item.title }}
      NuxtLink.px-4.py-6.ml-auto(v-if="!account.online" to="/account/signin") signin
      NuxtLink.px-4.py-6.ml-auto(v-else to="/account") account
  NuxtPage
</template>

<script setup>
// 全局引入代码高亮插件的样式
import "highlight.js/styles/atom-one-dark.css"

const route = useRoute();
const account = useState("account", () => ({
  id: 0,
  sid: '',
  name: "Last",
  online: false,
}));

const navItems = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Blog",
    path: "/blog",
  },
  {
    title: "Gallery",
    path: "/gallery",
  },
];

onMounted(() => {
  $fetch("/api/user/self").then((data) => {
    if (data) {
      console.log(data);
      account.value = data;
    }
  });
});

</script>

<style>
/** 全局滚动条取消空间占用, 防止渲染时闪烁 */
::-webkit-scrollbar {
  display: none;
}

/** markdown */
.markdown h1 {
  font-weight: bold;
  font-size: 2rem;
  margin: 1.5rem 0;
}

.markdown pre code {
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 14px;
}

.markdown table {
  border-collapse: collapse;
  border-spacing: 0;
  margin: 1rem 0;
}
.markdown table tr th {
  padding: 0.5rem;
}
.markdown table tr td {
  padding: 0.5rem;
}
.markdown p {
  margin: 2rem 0;
  word-wrap: break-word;
  word-break: break-all;
}
.markdown input[type="checkbox"] {
  position: relative;
  margin-right: 0.3em;
}
.markdown input[type="checkbox"]::before {
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
.markdown input[type="checkbox"]:checked::before {
  content: "\2713";
  color: #00aeec;
  background-color: #dff6fd;
}
</style>
