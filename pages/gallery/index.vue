<template lang="pug">
div.flex.flex-col.pt-16.pb-4(
  class="xl:(flex-row h-screen overflow-x-scroll) md:(px-12) lg:(px-12)"
)
  section.bg-dark-800.bg-opacity-20.rounded-md.p-12.m-2.min-w-64.flex.items-center.justify-center
    label.w-24.h-24.bg-dark-600.bg-opacity-20.rounded-md
      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, null)")
  section(v-if="pending") Loading..
  section.m-2.p-4.bg-opacity-20.bg-dark-800.rounded-md.flex.flex-col.justify-center.items-center.relative(
    class="xl:(flex-wrap)"
    v-else
    v-for="item in data.list"
  )
    img.rounded-md.m-1(v-for="file in item.files" :src="`/api/image/${file.id}`")
    label.w-32.h-16.bg-dark-600.bg-opacity-20.rounded-md.absolute.bottom-8.left-192.flex.justify-center.items-center
      span.font-bold.text-3xl.text-dark-800
      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, item)")
    button.bg-dark-600(@click="remove(item.id)") remove
</template>

<script>
export default {
  setup() {
    const { data, pending } = useFetch('/api/gallery')
    return { data, pending }
  },
  methods: {
    async create() {
      return await $fetch(`/api/gallery`, {
        method:  'POST',
        headers: {"Content-Type": "application/json"},
        body:    {name:'default', data:'default'},
      })
    },
    async upload(event, item) {
      if (!item) {
        item = await this.create()
        item.files = []
        this.data.list.push(item)
      }
      // 上传, 目标位置如果是new则先创建获得id, 否则目标位置本就有id ✨
      let data = new FormData();
      let files = event.target.files
      for (let file of files) data.append("image", file)
      fetch(`/api/gallery/${item.id}`, {
        method: 'POST',
        body: data
      }).then(res => res.json()).then(data => {
        this.data.list.forEach(x => {
          if (x.id === item.id) {
            data.forEach(it => x.files.push(it))
          }
        })
      })
    },
    remove(id) {
      this.data.list = this.data.list.filter(item => item.id !== id)
      $fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    }
  }
}
</script>
