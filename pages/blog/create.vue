<template lang="pug">
div.pt-24
  section.container.mx-auto.bg-white.bg-opacity-5.rounded-md.p-12.flex.flex-col
    textarea.auto.p-8.mb-2.min-h-120.rounded-md(v-model="blog.data", @input="input" @keyup.ctrl.enter="create()")
    button.bg-green-600.px-4.py-2.text-white.font-bold.rounded-md(@click="create()") Submit
</template>

<script>
export default {
  setup() {
    const router = useRouter()

    const blog = useState('createBlog', () => ({
      name: '',
      data: ''
    }))

    const input = function(e) {
      e.srcElement.style.height = '400px'
      e.srcElement.style.height = e.target.scrollHeight + 'px'
    }

    const create = function() {
      if (!this.blog.data) return console.log("输入不能为空");
      //const reg  = new RegExp("(?<=^# ).*?(?=\n)|(?<=\n# ).*?(?=\n)")
      //const list = this.blog.data.match(reg)
      //this.blog.name = list ? list[0] : "default"
      const reg  = new RegExp("^# .*\n")
      const list = this.blog.data.match(reg)
      this.blog.name = list ? list[0].replace('# ', '').replace('\n', '') : "default"
      fetch('/api/blog', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(this.blog)
      }).then(Response => {
        if (Response.status === 200) {
          router.push({path:'/blog'})
        }
        return Response.text()
      }).then(data => {
        console.log(data)
      })
    }

    return { blog, create, input }
  }
}
</script>
