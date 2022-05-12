<template lang="pug">
div.pt-24
  section.container.mx-auto.bg-white.p-12.flex.flex-col
    textarea.auto.p-8.mb-2(v-model="project.data", @input="input")
    button.bg-green-600.px-4.py-2.text-white.font-bold(@click="create") Submit
</template>

<script>
export default {
  setup() {
    const router = useRouter()
    const project = useState('createProject', () => ({
      name: 'default',
      data: 'default',
      edit: false,
    }))

    const create = () => {
      if (!this.project.data) return console.log('输入为空')
      const reg     = new RegExp("^# .*\n")
      const list    = this.project.data.match(reg)
      const name    = list ? list[0].replace('# ', '').replace('\n', '') : "default"
      const data    = this.project.data
      fetch('/api/project', {
        method:  'POST',
        headers: {"Content-Type": "application/json"},
        body:    JSON.stringify({name, data}),
      }).then(res => {
        console.log(res)
        router.push({path:'/'})
      })
      //if (!blog.data) return console.log('输入为空')
      //fetch('/api/project', {
      //  method: 'POST',
      //  headers: {"Content-Type": "application/json"},
      //  body: JSON.stringify(blog)
      //}).then(Response => Response.text()).then(data => {
      //  console.log(data)
      //  router.push({path:'/'})
      //})
    }

    const input = function(e) {
      e.srcElement.style.height = '400px'
      e.srcElement.style.height = e.target.scrollHeight + 'px'
    }

    return { project, create, input }
  }
}
</script>
