<template lang="pug">
div.bg-fixed.bg-cover.bg-no-repeat.bg-center(:style="`background-image:url(${background})`")
  div.flex.flex-col.justify-center.items-center.min-h-screen.bg-black.bg-opacity-50
    //.container.mx-auto.h-screen.flex.items-center.justify-center
    div.flex.flex-col.bg-white.bg-opacity-5.px-8.py-12.mx-auto.rounded-md
      div.text-red-500.text-4xl.font-bold.mb-4.transition-all.duration-450(class="hover:text-red-700") SIGNIN
      label.relative
        span.absolute.left-3.top-3.bg-red-700.text-transparent.bg-clip-text 🌱
        input.box-border.p-4.pl-12.mb-2.rounded-md.bg-white.bg-opacity-70.font-bold(v-model="account.name" placeholder="name")
      label.relative
        span.absolute.left-3.top-3.bg-red-700.text-transparent.bg-clip-text 🔒
        input.box-border.p-4.pl-12.mb-2.rounded-md.bg-white.bg-opacity-70.font-bold(v-model="account.password" placeholder="password" type="password")
      button.font-bold.text-white.p-4.bg-red-800.rounded-md.transition-all.duration-450.relative.bottom-0.right-0(@click="signin" class="hover:(bg-red-700 bottom-1 right-1)") signin
</template>

<script>
import background from '@/assets/image/background.jpg'
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
          this.account.id     = data.id
          this.account.name   = data.name
          this.account.online = true
          router.push({path:'/account'})
        }
      })
    }
    return { account, user, signin, background }
  }
}
</script>
