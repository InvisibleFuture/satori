<template lang="pug">
.min-h-screen.bg-gray-700
  header.absolute.left-0.top-0.right-0
    nav.container.mx-auto.flex.text-gray-400.text-xl.font-bold
      NuxtLink.p-4(to="/", :class="{'text-white': route.path==='/' }") Home
      NuxtLink.p-4(to="/blog", :class="{'text-white': route.path==='/blog' }") Blog
      NuxtLink.p-4(to="/gallery" :class="{'text-white': route.path==='/gallery' }") Gallery
      //NuxtLink.p-4(to="/user", :class="{'text-white': route.path==='/user' }") User
      NuxtLink.p-4.ml-auto(v-if="!account.online", to="/account/signin", :class="{'text-white': route.path==='/account/signin' }") signin
      NuxtLink.p-4.ml-auto(v-else, to="/account", :class="{'text-white': route.path==='/account' }") account
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
        this.account.name = data.name
        this.account.online = true        
      }
    })
  }
})
</script>

<style>
::-webkit-scrollbar {
  display: none;
}
html, body {
  background-color: rgba(55,65,81, 1);
  /**background-image: url(/assets/image/background.jpg);**/
}
.markdown img {
  border-radius: .25rem;
}
.markdown p {
  margin: 2rem 0;
}
.markdown .hljs {
  border-radius: 2rem;
  padding-top: 2rem;
}
.markdown input[type=checkbox] {
  position: relative;
  margin-right: .3em;
}
.markdown input[type=checkbox]::before {
  position: absolute;
  content: "\a0";
  display: inline-block;
  width: 1em;
  height: 1em;
  border-radius: .3em;
  background-color: grey;
  text-indent: .15em;
  line-height: .65;
}
input[type="checkbox"]:checked::before {
    content: "\2713";
    background-color: #EC4899;
}
</style>
