<template lang="pug">
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
</script>
