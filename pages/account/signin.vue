<template lang="pug">
div.flex.justify-center.items-center.min-h-screen
  div(class="w-1/2")
    div.bg-white.shadow-md.rounded.px-8.pt-6.pb-8.mb-4
      form(v-on:submit.prevent="signin")
        div.mb-4
          label.block.text-gray-700.text-sm.font-bold.mb-2(for="username") Username
          input#username.shadow.appearance-none.border.rounded.w-full.py-2.px-3.text-gray-700.leading-tight(
            class="focus:outline-none focus:shadow-outline",
            v-model="sign_data.name",
            type="text",
            placeholder="Username"
          )
        div.mb-6
          label.block.text-gray-700.text-sm.font-bold.mb-2(for="password") Password
          input#password.shadow.appearance-none.border.rounded.w-full.py-2.px-3.text-gray-700.mb-3.leading-tight(
            class="focus:outline-none focus:shadow-outline",
            v-model="sign_data.password",
            type="password",
            placeholder="******************"
          )
        div.flex.items-center.justify-between
          button.bg-blue-500.text-white.font-bold.py-2.px-4.rounded(
            class="hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            type="submit"
          ) Sign In
          a.inline-block.align-baseline.font-bold.text-sm.text-blue-500(
            class="hover:text-blue-800"
            href="#"
          ) Forgot Password?
</template>

<script setup>
const router = useRouter()
const account = useState("account")
const sign_data = ref({ name: "", password: "" })

const signin = () => {
  $fetch("/api/session", {
    method: "POST",
    body: JSON.stringify(sign_data.value),
    Headers: { "Content-Type": "application/json" }
  }).then((data) => {
    if (data.message) return alert(data.message)
    console.log('signin', data)
    data.user.online = true
    account.value = data.user
    router.push("/account")
  })
}
</script>
