<template lang="pug">
div.container.mx-auto.text-white.pt-24
  header.flex.flex-row-reverse.p-4
    //NuxtLink.rounded-md.bg-green-600.px-4.py-2.font-bold(to="/blog/create") create
    button.rounded-md.bg-green-600.px-4.py-2.font-bold(v-if="account.online" @click="edit.mode = !edit.mode") create
  // 弹出层编辑器
  section.absolute.bg-dark-800.bg-opacity-80.top-0.left-0.right-0.bottom-0.flex.flex-col(v-if="edit.mode")
      textarea.container.mx-auto.flex-1.bg-opacity-0.bg-dark-800.text-xl.p-12(
        class="focus:(outline outline-transparent)"
        v-focus
        v-model="edit.data"
        @input="input"
        @keyup.ctrl.enter="create()"
        @keyup.esc="edit.mode = !edit.mode"
      )
      button.absolute.top-8.right-8.bg-white.bg-opacity-0.w-16.h-16.transform.rotate-45.transition-all(
        class="hover:(bg-opacity-20 rotate-15 rounded-full)"
        title="Esc"
        @click.stop="edit.mode = !edit.mode"
      )
        span.block.bg-white.absolute.rounded-sm.w-1.h-9.top-4.left-8
        span.block.bg-white.absolute.rounded-sm.w-9.h-1.top-8.left-4
      button.bg-green-600.px-4.py-2.text-white.font-bold.rounded-md(@click="create()") Submit(Ctrl+Enter)
  // 内容加载状态
  section.m-2.p-4.rounded-xl.text-center(v-if="pending") Loading...
  section.m-2.p-4.bg-opacity-20.bg-dark-800.rounded-xl(v-else v-for="item in data.list" class="md:p-12")
    NuxtLink(:to="`/blog/${item.id}`")
      h2.text-2xl.font-bold {{ item.name }}
    p.text-sm.mb-4
      span.mr-4 {{ rwdate(item.createdAt) }}
      span.mr-4 {{ item.user.name }}
    div(v-if="account.online")
      button.bg-indigo-600.px-4.py-2.font-bold.mt-4.mr-4(@click="removeItem(item.id)") delete
      button.bg-indigo-600.px-4.py-2.font-bold.mt-4.mr-4 editor
  section.rounded-xl.py-12.text-center 加载更多..
</template>

<script>
export default {
  setup() {
    const account = useState('account')
    const edit = useState('createBlog', () => ({
      mode: false,
      name: '',
      data: '# Title\n\nData..'
    }))

    const input = function(e) {
      e.srcElement.style.height = '400px'
      e.srcElement.style.height = e.target.scrollHeight + 'px'
    }

    const create = function() {
      if (!this.edit.data) return console.log("输入不能为空");
      const reg  = new RegExp("(?<=^# ).*?(?=\n)|(?<=\n# ).*?(?=\n)")
      const list = this.edit.data.match(reg)
      this.edit.name = list ? list[0] : "default"
      fetch('/api/blog', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: this.edit.name,
          data: this.edit.data
        })
      }).then(Response => {
        if (Response.status === 200) {
          console.log(Response.status)
          this.edit.mode = false
          this.refresh()
        }
        return Response.text()
      }).then(data => {
        console.log(data)
      })
    }

    const { data, pending, refresh } = useFetch('/api/blog')
    return { data, pending, account, edit, input, create, refresh }
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
        if (Response.status === 200) {
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
  },
  directives: {
    'focus': {
      mounted(e) {
        e.focus()
      }
    }
  }
}
</script>
