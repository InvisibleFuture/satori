<template lang="pug">
div.container.mx-auto.pt-42
  //header.flex.w-3xl.mx-auto
  //  div.h-14.w-14.rounded-full.bg-pink-500.overflow-hidden(v-if="pending")
  //  NuxtLink.block.h-14.w-14.rounded-full.bg-pink-500.overflow-hidden(v-else :to="'/user/'+data.userId")
  //      img(v-if="!pending" :src="data.user.avatar")
  //  div.px-4.flex.flex-col.flex-1
  //    p.font-bold.text-black {{ pending ? '' : data.name }}
  //    div.flex.text-gray-600
  //      div.bg-pink-500.rounded-lg.w-24.mr-2(v-if="pending")
  //      NuxtLink.mr-2(v-else :to="'/user/'+data.userId") {{ data.user.name }}
  //      span.mr-2.text-gray-400 for
  //      span.mr-2 Oniex™ • 跟隨 • 
  //      div.bg-pink-500.rounded-lg.w-12(v-if="pending")
  //      a.text-pink-500(v-else) 僱用我們
  //  div.py-2
  //    button.mr-2 Save
  //    button.mr-2 Like
  section(v-if="pending") Loading..
  section.w-3xl.mx-auto.my-8(v-else)
    div(v-if="!blog.edit")
      article(v-html="marked.parse(data?.data || '', { breaks: true })")
      ul.flex.overflow-hidden.rounded-md.max-w-max.my-4
        li.bg-pink-400.w-12.h-12
        li.bg-pink-500.w-12.h-12
        li.bg-pink-600.w-12.h-12
        li.bg-pink-700.w-12.h-12
        li.bg-pink-800.w-12.h-12
        li.bg-pink-900.w-12.h-12
      div.flex.flex-row-reverse
        button(v-if="account.online" @click="edit_mode()") edit
      .flex.my-12(v-for="item in comments.list", :key="item._id")
        img.rounded-full.w-16.h-16.mr-4(:src="item.avatar")
        div
          .pb-2
            span.font-bold.mr-2 {{ item.name }}
            //span.font-bold.bg-pink-600.px-2.py-1.text-white.rounded-md.text-xs(
            //  v-if="true || item.user.gid === 1"
            //) admin
          div(v-html="marked.parse(item.data, { breaks: true })")
          .text-rose-300.font-bold.text-sm.my-2
            span {{ rwdate(item.createdAt) }}
          div
            button.font-bold.bg-pink-600.px-2.py-1.text-white.rounded-md.text-xs(
              @click="comment_remove(item.id)"
              v-if="account.online"
            ) delete
    div.flex(v-else)
      textarea.flex-auto.w-full.min-h-64.bg-opacity-10.bg-dark-200.p-4(
        v-model="blog.data"
        v-focus,tabindex="0"
        @input="input"
        @keyup.ctrl.enter="edit_submit()"
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
  //.flex.flex-col.my-12.w-3xl.mx-auto
  //  label.my-1
  //    input.rounded-lg.bg-gray-100.px-4.py-2(v-model="comments.name")
  //    span.ml-2.text-gray-500 name
  //  label.my-1
  //    input.rounded-lg.bg-gray-100.px-4.py-2(v-model="comments.mail")
  //    span.ml-2.text-gray-500 mail(不会被公开)
  //  label.my-1
  //    input.rounded-lg.bg-gray-100.px-4.py-2(v-model="comments.home")
  //    span.ml-2.text-gray-500 link
  //  label.my-1
  //    textarea.rounded-xl.bg-gray-100.p-4.w-full.min-h-xs(
  //      v-model="comments.data"
  //      placeholder="comments"
  //      @input="input"
  //      @keyup.ctrl.enter="comment_submit()"
  //    )
  //  div
  //    button.px-4.py-2.font-bold.rounded-md(@click="comment_submit()") 发表评论 (Ctrl + Enter)
</template>

<script>
import "highlight.js/styles/agate.css"
import hljs from "highlight.js"
import { marked } from "marked"
export default {
  setup() {
    //const { data, pending } = useFetch(`/api/project/${route.params.id}`)
    //const project = useState('editProject', () => {
    //  return {data:'', edit: false}
    //})
    const route = useRoute()
    const account = useState('account')
    const blog = useState('editBlog', () => ({
      edit: false,
      data: '',
      name: ''
    }))
    const comments = useState('comments', () => ({
      list: [],
      data: '',
      name: '',
      mail: '',
      home: '',
    }))

    const { data, pending } = useFetch(`/api/project/${route.params.id}`)
    return { data, pending, blog, marked, route, account, comments }
  },
  //mounted() {
  //  // 页面加载完毕后在开始载入讨论区
  //  fetch('/api/comment?blogId='+this.route.params.id).then(res=>res.json()).then(data=>{
  //    this.comments.list = data.list
  //  })
  //},
  updated() {
    // 检查尚未渲染的区块执行渲染
    for (let block of document.querySelectorAll("pre code")) {
      if (!block.classList.contains('hljs')) {
        hljs.highlightBlock(block);
      }
    }
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
    comment_remove(id) {
      this.comments.list = this.comments.list.filter(item => item.id !== id)
      fetch('/api/comment/'+ id, {method:'DELETE'}).then(res => res.json()).then(data => {
        console.log(data)
      })
    },
    comment_submit() {
      console.log('commentSubmit')
      fetch('/api/comment', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body:    JSON.stringify({
          name: this.comments.name,
          mail: this.comments.mail,
          home: this.comments.home,
          data: this.comments.data,
          blogId: this.route.params.id,
        }),
      }).then(async Response => {
        if (Response.status === 200) {
          this.comments.list.push(await Response.json())
          return
        }
        if (Response.status === 400) {
          console.log(await Response.text())
          return
        }
        console.log('未知')
      })
    },
    input(e) {
      e.srcElement.style.height = '300px'
      e.srcElement.style.height = e.target.scrollHeight + 'px'
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




<!--template lang="pug">
div.container.mx-auto.pt-48
  section(v-if="pending") Loading..
  section.m-2.p-4.bg-opacity-0.bg-dark-800.rounded-xl(v-else class="md:p-12")
    template(v-if="!project.edit")
      div.markdown(v-html="marked.parse(data.data, { breaks: true })")
      div.flex.flex-row-reverse
        button(v-if="account.online" @click="edit()") edit
    template(v-else)
      textarea.w-full.min-h-64.bg-opacity-10.bg-dark-200.p-4(v-model="project.data")
      button.bg-green-700.p-4(@click="submit()") submit
</template>

<script setup>
import { marked } from "marked"

const route = useRoute()
const account = useState('account')

const { data, pending } = useFetch(`/api/project/${route.params.id}`)
const project = useState('editProject', () => {
  return {data:'', edit: false}
})

const submit = function() {
  const reg  = new RegExp("^# .*\n")
  const list = this.project.data.match(reg)
  const name = list ? list[0].replace('# ', '').replace('\n', '') : "default"
  const data = this.project.data
  fetch(`/api/project/${route.params.id}`, {
    method:  'PATCH',
    headers: {"Content-Type": "application/json"},
    body:    JSON.stringify({name, data}),
  }).then(res => {
    console.log(res)
    this.data.data    = this.project.data
    this.project.edit = !this.project.edit
  })
}

const edit = function() {
  this.project.data = this.data.data
  this.project.edit = !this.project.edit
}
</script-->
