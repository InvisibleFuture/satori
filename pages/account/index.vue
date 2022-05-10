<template lang="pug">
.container.p-24.text-white
  div {{ account }}
  div {{ user }}
  div setting
  div 赞助此项目(bit eth)
  div 鸣谢 --列表(avatar+link)
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
