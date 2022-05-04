<template lang="pug">
div.text-white.pt-24
  header.container.mx-auto.bg-slate-500.p-20.mb-8
    NuxtLink.bg-green-600.px-4.py-2.font-bold(to="/blog/create") create
  section.container.mx-auto.my-4.p-8.rounded-xl.text-center(v-if="pending") Loading...
  section.container.mx-auto.my-4.p-8.bg-opacity-20.bg-dark-900.rounded-xl(v-else v-for="item in data.list")
    NuxtLink(:to="`/blog/${item.id}`")
      h2.text-2xl.font-bold {{ item.name }}
    p.text-sm
      span.mr-4 {{ rwdate(item.createdAt) }}
      span.mr-4 {{ item.user.name }}
    p {{ item.data }}
    div
      button.bg-indigo-600.px-4.py-2.font-bold.mt-4.mr-4(@click="removeItem(item.id)") delete
      button.bg-indigo-600.px-4.py-2.font-bold.mt-4.mr-4 editor
  section.container.mx-auto.my-4.rounded-xl.p-8.text-center 加载更多..
</template>

<script>
export default {
  setup() {
    const { data, pending } = useFetch('/api/blog')

    return {
      data,
      pending,

      // 将 UTC 时间转换成阅读格式
      rwdate(utc='') {
        const t = new Date(utc);
        return utc ? `${t.getMonth() + 1}月 ${t.getDate()}, ${t.getFullYear()}` : '未知'
      },

      // 无法直接使用 data, 使用 this 传递
      removeItem(id) {
        fetch(`/api/blog/${id}`, { method: 'DELETE' }).then(Response => {
          if (Response.statusCode === 200) {
            this.data.list = this.data.list.filter(item => item.id !== id)
            console.log('删除成功')
          }
        })
      }

    }
  }
}
</script>
