<template lang="pug">
.py-24
  div.mx-auto.rounded-md.w-md.p-12.flex.flex-col.bg-white.bg-opacity-5.mt-48
    div.text-white.text-emerald-600.text-4xl.font-bold.mb-4 SIGNIN
    input.box-border.p-4.mb-2.rounded-md(v-model="account.name" placeholder="name")
    input.box-border.p-4.mb-2.rounded-md(v-model="account.password" placeholder="password")
    button.font-bold.text-white.p-4.bg-green-600.rounded-md(@click="signin") signin
</template>

<script>
export default {
  setup() {
    const user = useCookie('user')
    const account = useState('account')
    const router = useRouter()

    const signin = function() {
      console.log(this.account.name, this.account.password)
      fetch('/api/session', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: this.account.name,
          password: this.account.password,
        })
      }).then(res => res.json()).then(data => {
        console.log(data)
        if (data) {
          console.log(data)
          this.account.name = data.name
          this.account.online = true
          router.push({path:'/account'})
        }
      })
    }
    return { account, user, signin }
  }
}
</script>
