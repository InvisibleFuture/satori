<template lang="pug">
div.container.mx-auto.pt-32
  div(v-if="pending")
  div(v-else)
    h1 # {{ data.name }}
    p(v-for="item in data.blogs") {{ item.name }}
</template>

<script>
export default {
  setup() {
    const route = useRoute()
    const { data, pending } = useFetch(`/api/tag/${route.params.id}`)
    return { data, pending, route }
  }
}
</script>
