<template lang="pug">
div.container.mx-auto.pt-32.text-white.py-32
  div(v-if="pending")
  div.bg-white.bg-opacity-5.px-16.py-12.rounded-md(v-else)
    div(v-if="!blog.edit")
      div.markdown(v-html="marked.parse(data.data, { breaks: true })")
      ul.flex.overflow-hidden.rounded-md.max-w-max.my-4
        li.bg-pink-400.w-12.h-12
        li.bg-pink-500.w-12.h-12
        li.bg-pink-600.w-12.h-12
        li.bg-pink-700.w-12.h-12
        li.bg-pink-800.w-12.h-12
        li.bg-pink-900.w-12.h-12
      div.flex.flex-row-reverse
        button.bg-green-700.py-2.px-4.rounded-md(v-if="account.online" @click="edit_mode()") edit {{ blog.edit }}
      //.flex.my-12(v-for="item in postlist", :key="item._id")
      //  img.rounded-full.w-16.h-16.mr-4(:src="item.user.avatar")
      //  div
      //    .pb-2
      //      span.font-bold.mr-2 {{ item.user.name }}
      //      span.font-bold.bg-pink-600.px-2.py-1.text-white.rounded-md.text-xs(
      //        v-if="item.user.gid === 1"
      //      ) admin
      //    div(v-html="marked.parse(item.data, { breaks: true })")
      //    .text-rose-300.font-bold.text-sm.my-2
      //      span {{ rwdate(item.createdAt) }}
    div.flex(v-else)
      textarea.flex-auto.w-full.min-h-64.bg-opacity-10.bg-dark-200.p-4(
        v-model="blog.data",
        v-focus,tabindex="0",
        @keyup.ctrl.enter="edit_submit()",
        @keydown.esc="edit_mode()"
      )
      div.ml-4.w-64
        ul
          li.flex.relative.bg-dark-800.bg-opacity-20.my-1.rounded-md.p-2.cursor-pointer(v-for="file in data.files" @click="edit_useimg(file)")
            div.w-12.h-12.mr-2.bg-cover.rounded-md(v-if="file.type.indexOf('image/') !== -1" :style="`background-image:url(/api/image/${file.id})`")
            div.flex-1.overflow-hidden
              p.whitespace-nowrap.text-ellipsis.text-md.font-bold {{ file.name }}
              p.whitespace-nowrap.text-ellipsis.text-slate-400.text-sm {{ fileSize(file.size) }}
            button.rounded-full.w-8.h-8.bg-black.font-bold.bg-opacity-20.transition-all(
              class="hover:bg-opacity-40 absolute top-0 right-0"
              @click="removeFile(file.id)"
            ) x
          li.flex.bg-dark-800.bg-opacity-20.my-1.rounded-md.overflow-hidden.cursor-pointer
            label.font-bold.text-center.block.w-full.p-2 +
              input.hidden(type="file", accept="image/*", multiple, @change="edit_upload($event)")
        button.absolute.right-2.bottom-2.z-10.bg-teal-600.px-6.py-4.font-bold.text-white.rounded-md(
          @click="edit_submit()"
        ) Submit (Ctrl + Enter)
</template>

<script>
import { marked } from "marked"
export default {
  setup() {
    const route = useRoute()
    const account = useState('account')
    const blog = useState('blog', () => ({
      edit: false,
      data: '',
      name: ''
    }))
    const { data, pending } = useFetch(`/api/blog/${route.params.id}`)
    return { data, pending, blog, marked, route, account }
  },
  methods: {
    rwdate(utc) {
      let t = new Date(utc);
      return t.getMonth() + 1 + "月 " + t.getDate() + ", " + t.getFullYear();
    },
    fileSize(size) {
      let kb = (size / 1024).toFixed(2)
      if (kb < 1024) return `${kb} KB`
      let mb = (kb / 1024).toFixed(2)
      if (mb < 1024) return `${mb} MB`
      let gb = (mb / 1024).toFixed(2)
      return `${gb} GB`
    },
    removeFile(id) {
      this.data.files = this.data.files.filter(item => item.id !== id)
      $fetch(`/api/file/${id}`, { method: 'DELETE' }).then(data => {
        console.log(data)
      })
    },
    // 编辑模式
    edit_mode() {
      this.blog.edit = !this.blog.edit
      this.blog.data = this.data.data
    },
    edit_submit() {
      if (!this.blog.data) return console.log("输入不能为空");
      const reg  = new RegExp("(?<=^# ).*?(?=\n)|(?<=\n# ).*?(?=\n)")
      const list = this.blog.data.match(reg)
      const name = list ? list[0] : "default"
      const data = this.blog.data
      fetch(`/api/blog/${this.route.params.id}`, {
        method:  'PATCH',
        headers: {"Content-Type": "application/json"},
        body:    JSON.stringify({name, data}),
      }).then(res => {
        console.log(res)
        this.data.data = this.blog.data
        this.blog.edit = !this.blog.edit
      })
    },
    edit_useimg(item) {
      let value = `\n![${item.name}](/api/image/${item.id})\n`
      let tclen = this.blog.data.length
      let tc = document.querySelector('textarea') // this.$refs.message
      tc.focus()
      if (typeof document.selection !== "undefined") {
        document.selection.createRange().text = value
      } else {
        this.blog.data = tc.value.substr(0, tc.selectionStart) + value +
        tc.value.substring(tc.selectionStart, tclen);
      }
    },
    edit_upload(event) {
      let data = new FormData();
      let files = event.target.files
      for (let file of files) data.append("photos", file)
      fetch(`/api/blog/${this.route.params.id}`, {
        method: 'POST',
        body: data
      }).then(res => res.json()).then(data => {
        console.log(data)
        let value = '\n'
        data.forEach(item => {
          // TODO: type image?
          this.data.files.push(item)
          value += `![${item.name}](/api/image/${item.id})\n`
        })
        let tclen = this.blog.data.length
        let tc = document.querySelector('textarea') // this.$refs.message
        tc.focus()
        if (typeof document.selection !== "undefined") {
          document.selection.createRange().text = value
        } else {
          this.blog.data = tc.value.substr(0, tc.selectionStart) + value +
          tc.value.substring(tc.selectionStart, tclen);
        }
      })
    }
  },
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      },
    },
  },
}
</script>
