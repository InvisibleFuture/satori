<template lang="pug">
div.pt-24
  header.container.mx-auto.bg-slate-500.p-20.mb-8
    NuxtLink.bg-green-600.px-4.py-2.text-white.font-bold(to="/user/create") create
  .container.mx-auto
    div(v-if="pending") Loading...
    ul.text-white(v-else)
      li.flex.bg-dark-900.bg-opacity-20.p-12.my-4.rounded-md(v-for="item in data.list")
        div.felx.flex-col.justify-center.items-center.text-center.mr-4
          img.bg-dark-500.rounded-full.text-white.w-24.h-24(v-if="item.avatar" :src="item.avatar" :title="item.name")
          div.bg-dark-500.rounded-full.text-white.w-24.h-24(v-else)
          div.mr-2.font-bold.text-2xl {{ item.name }}
          div.mr-2 {{ item.age }}
        div.flex-1
          p {{ rwdate(item.createdAt) }}
          p {{ item }}
</template>

<script>
export default {
  setup() {
    const { data, pending } = useFetch('/api/user')

    const rwdate = function(utc='') {
      const t = new Date(utc);
      return utc ? `${t.getMonth() + 1}月 ${t.getDate()}, ${t.getFullYear()}` : '未知'
    }

    return { data, pending, rwdate }
  }
}
</script>
