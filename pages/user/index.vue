<template lang="pug">
div.pt-24
  header.container.mx-auto.bg-slate-500.p-20.mb-8
    NuxtLink.bg-green-600.px-4.py-2.text-white.font-bold(to="/user/create") create
  .container.mx-auto
    div(v-if="pending") Loading...
    ul.bg-white.p-12.m-2(v-else)
      li.my-2(v-for="item in data.list")
        img.bg-dark-100.rounded-full.text-white.w-24.h-24(v-if="item.avatar" :src="item.avatar" :title="item.name")
        div.bg-dark-100.rounded-full.text-white.w-24.h-24(v-else)
        span.mr-2 {{ item.name }}
        span.mr-2 {{ item.age }}
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
