<template lang="pug">
.container.py-24
  div {{ account }}
  div.flex.flex-col.w-xs.p-8
    input(v-model="account.name" placeholder="name")
    input(v-model="account.passwword" placeholder="password")
    button(@click="signin") signin
  div {{ user }}
</template>

<script>
export default {
  setup() {
    const user = useCookie('user')
    const account = useState('account')
    const signin = function() {
      //user.value = (user.value || 0) + 1
      //user.value = { name: this.account.name }      
      fetch('/api/session', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: this.account.name,
          password: this.account.password,
        })
      }).then(Response => Response.text()).then(data => {
        console.log(data)
        //router.push({path:'/user'})
      })
    }
    return { account, user, signin }
  }
}
</script>
