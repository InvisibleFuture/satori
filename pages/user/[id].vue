<template lang="pug">
div.mt-24.container.mx-auto
  section.flex.p-8
    div.flex-1
      div.w-32.h-32.bg-gray-100.rounded-full
      div.my-4.font-bold.text-2xl USER
      div.my-8.font-bold.text-4xl Info..
      div.my-8
        button.mr-4 Follow
        button.mr-4 Hire Me
    div.flex-1
  section.border-b-1.border-gray-100.mt-12
    p Like Follow Create Commit
</template>

<script>
export default {
  setup() {
    const route = useRoute()
    const { data, peding } = useFetch('/api/user/'+route.params.id)
    return data, peding
  }
}
</script>
