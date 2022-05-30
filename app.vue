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
/*
 * 默认样式
 */
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

/*
 * Button
 */
button {
  color: #FFFFFF;
  background-color: #00AB55;
  padding: .4em 1.1em;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  border-radius: .5em;
  box-shadow: 0 .5em 1.1em 0 rgb(0 171 85 / 24%);
  transition: all .25s;
}
button:hover {
  color: #EEEEEE;
  background-color: #008855;
  box-shadow: none;
}
/**
ul li {
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
}
 */


@keyframes example {
  from {top:2em}
  to {top:0;}
}
section, .list .item, .homelist {
  position: relative;
  animation: example .75s ease 0s 1 normal both;
  /* 变化 持续时间 动画曲线 延迟执行 执行次数 运行方向 覆盖默认状态 */
}
/*section+section {animation-delay: .05s;}
section+section+section {animation-delay: .15s;}
section+section+section+section {animation-delay: .25s;}
section+section+section+section+section {animation-delay: .35s;}
section+section+section+section+section+section {animation-delay: .45s;}
section+section+section+section+section+section+section {animation-delay: .55s;}
section+section+section+section+section+section+section+section {animation-delay: .65s;}
section+section+section+section+section+section+section+section+section {animation-delay: .75s;}
section+section+section+section+section+section+section+section+section+section {animation-delay: .85s;}
section+section+section+section+section+section+section+section+section+section+section {animation-delay: .95s;}
*/
</style>
