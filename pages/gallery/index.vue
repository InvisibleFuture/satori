<template lang="pug">
div.h-screen.overflow-x-scroll.flex.flex-row-reverse.px-8.pt-16.pb-4
  section.bg-dark-800.bg-opacity-20.rounded-md.p-12.m-2.min-w-64.flex.items-center.justify-center
    label.w-24.h-24.bg-dark-600.bg-opacity-20.rounded-md
      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, null)")
  section.bg-dark-800.bg-opacity-20.rounded-md.p-12.m-2.min-w-400.flex.flex-wrap.justify-center.items-center.relative(
    v-for="item in data.list"
  )
    img.rounded-md.m-1(v-for="file in item.files" :src="`/api/image/${file.id}`")
    label.w-32.h-16.bg-dark-600.bg-opacity-20.rounded-md.absolute.bottom-8.left-192.flex.justify-center.items-center
      span.font-bold.text-3xl.text-dark-800
      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, item)")
</template>

<script>
export default {
  setup() {
    const gallery = useState('gallery', () => ({
      list: []
    }))

    const { data, pending } = useFetch('/api/gallery')

    return { gallery, data, pending }
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
      if (!item) item = await this.create()
      console.log(item)

      // 上传, 目标位置如果是new则先创建获得id, 否则目标位置本就有id ✨
      let data = new FormData();
      let files = event.target.files
      for (let file of files) data.append("image", file)
      fetch(`/api/gallery/${item.id}`, {
        method: 'POST',
        body: data
      }).then(res => res.json()).then(data => {
        data.forEach(it => item.files.push(it))
        //let value = '\n'
        //data.forEach(item => {
        //  // TODO: type image?
        //  value += `![${item.name}](/api/image/${item.id})\n`
        //})
        //let tclen = this.blog.data.length
        //let tc = document.querySelector('textarea') // this.$refs.message
        //tc.focus()
        //if (typeof document.selection !== "undefined") {
        //  document.selection.createRange().text = value
        //} else {
        //  this.blog.data = tc.value.substr(0, tc.selectionStart) + value +
        //  tc.value.substring(tc.selectionStart, tclen);
        //}
      })
    },
  }
}
</script>
