<template lang="pug">
div.h-screen.overflow-x-scroll.bg-white.pt-24.flex.bg-slate-500
  section.bg-red-300.p-12.m-2.w-64(v-for="i in 24") Gallery
</template>

<script>
export default {
  setup() {
    const list = []
    return { list }
  }
}
</script>
