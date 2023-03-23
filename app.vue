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
const route = useRoute();
const account = useState("account", () => ({
  id: 0,
  name: "Last",
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
  $fetch("/api/user/self").then((data) => {
    if (data) {
      console.log(data);
      data.online = true;
      account.value = data;
    }
  });
});

</script>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
