<template lang="pug">
.min-h-screen.bg-white.text-gray-800
  header.absolute.left-0.top-0.right-0.border-gray-100(:class="{'border-b-1' : route.path!=='/' && route.path!=='/account/signin'}")
    nav.container.mx-auto.flex.text-gray-400.text-lg.font-bold
      NuxtLink.px-4.py-6(to="/", :class="{'text-white': route.path==='/' }") Home
      NuxtLink.px-4.py-6(to="/blog", :class="{'text-pink-500': route.path==='/blog' }") Blog
      NuxtLink.px-4.py-6(to="/gallery" :class="{'text-pink-500': route.path==='/gallery' }") Gallery
      //NuxtLink.px-4.py-6(to="/project" :class="{'text-pink-500': route.path==='/project' }") Project
      NuxtLink.px-4.py-6.ml-auto(v-if="!account.online", to="/account/signin", :class="{'text-pink-500': route.path==='/account/signin' }") signin
      NuxtLink.px-4.py-6.ml-auto(v-else, to="/account", :class="{'text-pink-500': route.path==='/account' }") account
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
  /*background-color: rgba(55,65,81, 1);*/
  background-color: rgba(255,255,255, 1);
  /**background-image: url(/assets/image/background.jpg);**/
}
/*
 * 文章样式
 */
article h1 {
  font-weight: bold;
  font-size: 2rem;
}
article img {
  border-radius: 3rem;
  cursor: pointer;
}
article p {
  margin: 2rem 0;
  word-wrap: break-word;
  word-break:break-all;
}
article .hljs {
  border-radius: 2rem;
  padding-top: 2rem;
}
article input[type=checkbox] {
  position: relative;
  margin-right: .3em;
}
article input[type=checkbox]::before {
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
article input[type="checkbox"]:checked::before {
    content: "\2713";
    background-color: #EC4899;
}

/*
 * Button
 */
button {
  color: #FFFFFF;
  background-color: #EC4899;
  padding: .4em 1.1em;
  cursor: pointer;
  user-select: none;
  font-weight: 700;
  border-radius: .5em;
  box-shadow: 0 .5em 1.1em 0 rgba(236,72,153,.35);
  transition: all .25s;
}
button:hover {
  color: #EEEEEE;
  background-color: #EC4899;
  box-shadow: none;
}

/*
 * A link
 */
a:hover {
  color: #EC4899;
}


@keyframes example {
  from {top:2em}
  to {top:0;}
}
section, .list .item, .homelist {
  position: relative;
  animation: example .75s ease 0s 1 normal both;
  /* 变化 持续时间 动画曲线 延迟执行 执行次数 运行方向 覆盖默认状态 */
}
</style>
