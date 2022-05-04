<template lang="pug">
div.pt-24
  section.container.mx-auto.bg-white.p-12.flex.flex-col
    p 创建在线账户, 仅在需要获得在线存储的私有数据服务使用账号
    p 通常无需注册即可使用所有特性功能
    input.border.px-8.py-4.my-4(v-model="user.name", placeholder="name")
    input.border.px-8.py-4.my-4(v-model="user.mail", placeholder="mail")
    input.border.px-8.py-4.my-4(v-model="user.password", placeholder="password")
    button.bg-green-600.px-4.py-2.text-white.font-bold(@click="create") Submit
</template>

<script>
export default {
  setup() {
    const router = useRouter()

    const user = {
      name: '',
      mail: '',
      password: '',
    }

    const create = () => {
      if (!user.name) return console.log('输入名为空')
      fetch('/api/user', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
      }).then(Response => Response.text()).then(data => {
        console.log(data)
        router.push({path:'/user'})
      })
    }

    return { user, create }
  }
}
</script>
