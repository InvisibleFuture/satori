<template lang="pug">
div.container.mx-auto.text-white.pt-24
  header.flex.flex-row-reverse.p-4
    NuxtLink.rounded-md.bg-green-600.px-4.py-2.font-bold(to="/blog/create") create
  section.m-2.p-4.rounded-xl.text-center(v-if="pending") Loading...
  section.m-2.p-4.bg-opacity-20.bg-dark-800.rounded-xl(v-else v-for="item in data.list" class="md:p-12")
    NuxtLink(:to="`/blog/${item.id}`")
      h2.text-2xl.font-bold {{ item.name }}
    p.text-sm.mb-4
      span.mr-4 {{ rwdate(item.createdAt) }}
      span.mr-4 {{ item.user.name }}
    div.overflow-hidden.markdown(v-html="marked.parse(removeTitle(item.data), { breaks: true })")
    div(v-if="account.online")
      button.bg-indigo-600.px-4.py-2.font-bold.mt-4.mr-4(@click="removeItem(item.id)") delete
      button.bg-indigo-600.px-4.py-2.font-bold.mt-4.mr-4 editor
  section.rounded-xl.py-12.text-center 加载更多..
</template>

<script>
import "highlight.js/styles/agate.css"
import hljs from "highlight.js"
import { marked } from 'marked'
export default {
  setup() {
    const account = useState('account')
    const { data, pending } = useFetch('/api/blog')

    onMounted(() => {
      setTimeout(() => {
        for (let block of document.querySelectorAll("pre code")) {
          hljs.highlightBlock(block);
        }
      }, 100);
    })

    return { data, pending, account, marked }
  },
  methods: {
    // 将 UTC 时间转换成阅读格式
    rwdate(utc='') {
      const t = new Date(utc);
      return utc ? `${t.getMonth() + 1}月 ${t.getDate()}, ${t.getFullYear()}` : '未知'
    },
    // 无法直接使用 data, 使用 this 传递
    removeItem(id) {
      fetch(`/api/blog/${id}`, { method: 'DELETE' }).then(Response => {
        if (Response.statusCode === 200) {
          this.data.list = this.data.list.filter(item => item.id !== id)
          console.log('删除成功')
        }
      })
    },

    // Remove title 第一行开始的, 行首是 # 号且间隔一个空格后是字符串的, 且直到结尾不再有 # 号
    removeTitle(data="未命名档") {
      let reg = new RegExp("^# .*\n")
      return data.replace(reg, '')
      //let reg = new RegExp("(?<=^# ).*?(?=\n)|(?<=\n# ).*?(?=\n)", 'i');
      //return data.replace(reg, '')
    },
  }
}
</script>
