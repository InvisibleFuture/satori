<template lang="pug">
.min-h-screen.bg-gray-700
  header.absolute.left-0.top-0.right-0
    nav.container.mx-auto.flex.text-gray-300.text-xl.font-bold
      NuxtLink.p-6(to="/", :class="{'text-white': route.path === '/' }") Home
      NuxtLink.p-6(to="/blog", :class="{'text-white': route.path === '/blog' }") Blog
      NuxtLink.p-6(to="/user", :class="{'text-white': route.path === '/user' }") User
  NuxtChild
</template>

<script>
export default defineComponent({
  setup() {
    // 独占模式, 全屏只有一个元素主体且将其它元素撤离
    // const status = useState("status", () => ({
    //   dark: false,
    //   background: false,
    // }))

    const route   = useRoute()
    const session = useCookie('sid')
    const account = useState("account", () => ({
      online: false,
      id: 0,
      gid: 0,
      name: "游客",
      avatar: "",
      password: '',
    }))

    // onMounted(function() {
    //   setTimeout(() => {
    //     console.log(23332)
    //     console.log(account)
    //     this.account.online = true
    //   }, 1)
    // })
    // const {data} = await useFetch('/api/account')
    // console.log(data.name)
    // useFetch('/api/account').then((value) => {
    //   console.log(value)
    // })

    return  { route, account, session }
  },
  //methods: {
  //  mve() {
  //    if (session.value) {
  //      fetch("/api/account").then((res) => res.json()).then((data) => {
  //        console.log(data)
  //        if (data) {
  //          this.account.name = data.name
  //          this.account.online = true
  //        }
  //      })
  //    }
  //  }
  //}
})
</script>
