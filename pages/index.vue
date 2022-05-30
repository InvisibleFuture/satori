<template lang="pug">
div.bg-fixed.bg-cover.bg-no-repeat.bg-center(:style="`background-image:url(${background})`")
  div.flex.flex-col.justify-center.items-center.text-white.min-h-screen.bg-black.bg-opacity-50
    h1.text-4xl.mx-4 {{ kotoba() }}
    div.flex.flex-row.flex-wrap.px-8(v-if="!pending")
      NuxtLink.homelist.p-2.m-1(
        v-for="(item, index) in data.list" :to="`/project/${item.id}`"
        :style="`animation-delay: .${index}s`"
      ) {{ item.name }}
      NuxtLink.p-2.m-1(v-if="session" to="/project/create") +
</template>

<script>
import background from '@/assets/image/background.jpg'
export default defineComponent({
  setup() {
    const session = useCookie('sid')
    const { data, pending } = useFetch('/api/project')
    return { data, pending, background, session }
  },
  methods: {
    kotoba() {
      const arr = [
        "魔を封じ。あの日、出会いは唐突に。",
        "夢の時。本当に夢のよう。",
        "幻想は。どこまでも続く。",
        "怪奇の。手にかかる様で。",
        "紅き運命は。二人を定むのか。",
      ]
      return arr[Math.floor(Math.random() * arr.length)]
    }
  }
})
</script>
