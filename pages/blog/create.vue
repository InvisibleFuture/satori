<template lang="pug">
div.pt-24
  section.container.mx-auto.bg-white.p-12.flex.flex-col
    textarea.auto.p-8.mb-2(v-model="blog.data", @input="input")
    button.bg-green-600.px-4.py-2.text-white.font-bold(@click="create") Submit
</template>

<script>
export default {
  setup() {
    const router = useRouter()

    const blog = {
      name: 'default',
      data: 'default',
    }

    const input = function(e) {
      e.srcElement.style.height = '400px'
      e.srcElement.style.height = e.target.scrollHeight + 'px'
    }

    const create = () => {
      if (!blog.data) return console.log('输入为空')
      fetch('/api/blog', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(blog)
      }).then(Response => Response.text()).then(data => {
        console.log(data)
        router.push({path:'/blog'})
      })
    }

    return { blog, create, input }
  }
}
</script>
