<template lang="pug">
div.h-screen.overflow-x-scroll.pt-24.flex.flex-row-reverse.px-8
  section.bg-dark-800.bg-opacity-20.rounded-md.p-12.m-2.min-w-64.flex.items-center.justify-center
    label.w-64.h-64.bg-green-600.rounded-md
      input.hidden(type="file", accept="image/*", multiple, @change="upload($event)")
  section.bg-red-300.rounded-md.p-12.m-2.w-128(v-for="item in gallery.list") {{ item }}
  //section.bg-red-300.rounded-md.p-12.m-2.w-64(v-for="i in 24") Gallery ✨
  //button.bg-yellow-400.rounded-md.p-4.text-white.font-bold(@click="add()") +
</template>

<script>
export default {
  setup() {
    const gallery = useState('gallery', () => ({
      list: []
    }))

    return { gallery }
  },
  methods: {
    upload(event) {
      let data = new FormData();
      let files = event.target.files
      for (let file of files) data.append("image", file)
      fetch(`/api/gallery/${this.route.params.id}`, {
        method: 'POST',
        body: data
      }).then(res => res.json()).then(data => {
        console.log(data)
        let value = '\n'
        data.forEach(item => {
          // TODO: type image?
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
    },
    add() {
      this.gallery.list.push({name:'default' + this.gallery.list.length})
      console.log('add')
      //let data = {name:'default'}
      //console.log(data)
      //this.list.push(data)
      //$fetch('/api/gallery', {
      //  method: 'POST',
      //  headers: {"Content-Type": "application/json"},
      //  body: JSON.stringify(data)
      //}).then(data => {
      //  console.log(data)
      //  this.list.push(data)
      //})
    }
  }
}
</script>
