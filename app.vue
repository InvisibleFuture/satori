<template lang="pug">
.min-h-screen.bg-white.text-gray-800
  header.absolute.left-0.top-0.right-0.border-gray-100(
    :class="{ 'border-b-1': route.path !== '/' && route.path !== '/account/signin' }"
  )
    nav.container.mx-auto.flex.text-gray-400.text-lg.font-bold
      template(v-for="item in navItems")
        NuxtLink.px-4.py-6.transition-all.duration-150(
          class="hover:text-gray-800",
          :class="{ 'text-black': route.path === item.path }",
          :to="item.path"
        ) {{ item.title }}
      NuxtLink.px-4.py-6.ml-auto(
        v-if="!account.online",
        to="/account/signin",
      ) signin
      NuxtLink.px-4.py-6.ml-auto(
        v-else,
        to="/account"
      ) account
  NuxtPage
</template>

<script setup>
const route = useRoute();

const account = useState("account", () => ({
  online: false,
  id: 0,
  gid: 0,
  name: "Last",
  avatar: "",
  password: "XOM",
  online: false
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
  // 取会话ID(如果有会话ID，尝试获取用户信息)
  const session = useCookie("session");
  console.log('session', session.value);

  if (session.value) {
    $fetch("/api/account").then((data) => {
      if (data) {
        account.value = data;
      }
    });
  }
});


//mounted() {
//  $fetch('/api/account').then(data => {
//    if (data) {
//      this.account.name = data.name
//      this.account.online = true
//    }
//  })
//}
</script>

<style>
/*
 * 默认样式
 */
::-webkit-scrollbar {
  display: none;
}
html,
body {
  background-color: rgba(55, 65, 81, 1);
  /*background-color: rgba(255, 255, 255, 1);**/
}

/*
 * Button
 */
button {
  color: #ffffff;
  background-color: #ec4899;
  padding: 0.4em 1.1em;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  border-radius: 0.5em;
  box-shadow: 0 0.5em 1.1em 0 rgba(236, 72, 153, 0.35);
  transition: all 0.25s;
}
button:hover {
  color: #eeeeee;
  background-color: #ec4899;
  box-shadow: none;
}
</style>
