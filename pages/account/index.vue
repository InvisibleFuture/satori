<template lang="pug">
.container.p-24.text-white
  div {{ account }}
  div {{ user }}
</template>

<script>
export default {
  setup() {
    const user = useCookie('sid')
    const account = useState('account')

    return { account, user }
  }
}
</script>
