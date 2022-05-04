<template lang="pug">
div.container.mx-auto.pt-32.text-white
  div(v-if="pending")
  div(v-else)
    button.bg-green-700.p-4(@click="edit()") edit {{ project.edit }}
    template(v-if="!project.edit")
      //h1.font-bold.text-2xl.my-4 # {{ data.name }}
      //p {{ data.data }}
      div.markdown(v-html="marked.parse(data.data, { breaks: true })")
    template(v-else)
      textarea.w-full.min-h-64.bg-opacity-10.bg-dark-200.p-4(v-model="project.data")
      button.bg-green-700.p-4(@click="submit()") submit
</template>

<script>
import { marked } from "marked"
export default {
  setup() {
    const route = useRoute()
    const { data, pending } = useFetch(`/api/project/${route.params.id}`)
    const project = useState('edit', () => {
      return {data:'', edit: false}
    })

    return {
      data, pending, project,
      marked,

      submit() {
        const reg     = new RegExp("(?<=^# ).*?(?=\n)|(?<=\n# ).*?(?=\n)")
        const list    = this.project.data.match(reg)
        const name    = list ? list[0] : "default"
        const data    = this.project.data
        fetch(`/api/project/${route.params.id}`, {
          method:  'PATCH',
          headers: {"Content-Type": "application/json"},
          body:    JSON.stringify({name, data}),
        }).then(res => {
          console.log(res)
          this.data.data    = this.project.data
          this.project.edit = !this.project.edit
        })
      },

      edit() {
        this.project.data = this.data.data
        this.project.edit = !this.project.edit
      }

    }
  }
}
</script>

<style>
div.markdown h1 {
  font-weight: bold;
  font-size: 2rem;
}
</style>