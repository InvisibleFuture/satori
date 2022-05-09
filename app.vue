<template lang="pug">
.min-h-screen.bg-gray-700
  header.absolute.left-0.top-0.right-0
    nav.container.mx-auto.flex.text-gray-400.text-xl.font-bold
      NuxtLink.p-6(to="/", :class="{'text-white': route.path==='/' }") Home
      NuxtLink.p-6(to="/blog", :class="{'text-white': route.path==='/blog' }") Blog
      NuxtLink.p-6(to="/user", :class="{'text-white': route.path==='/user' }") User
      NuxtLink.p-6.ml-auto(to="/account/signin", :class="{'text-white': route.path==='/account/signin' }") signin
  NuxtChild
</template>

<script>
export default defineComponent({
  setup() {
    const route   = useRoute()
    const account = useState("account", () => ({
      online: false,
      id: 0,
      gid: 0,
      name: "Last",
      avatar: "",
      password: 'XOM',
    }))
    return  { route, account }
  },
  mounted() {
    $fetch('/api/account').then(data => {
      if (data) {
        console.log(data)
        this.account.name = data.name
        this.account.online = true        
      }
    })
  }
})
</script>
