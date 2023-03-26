<template lang="pug">
div.container.mx-auto.p-24
  div.relative.h-32.w-48.mx-auto
    div.absolute.rounded-full.w-32.h-32.left-0.top-0.bg-gray-200.transition-all.duration-700.cursor-pointer(
      :class="{'left-16': avatar_active === 1, 'z-10': avatar_active === 1}"
      @click="avatar_click(0)"
    )
    div.absolute.rounded-full.w-32.h-32.left-0.top-0.bg-gray-600.transition-all.duration-700.cursor-pointer(
      :class="{'left-16': avatar_active === 0, 'z-10': avatar_active === 0}"
      @click="avatar_click(1)"
    )
  div.my-4.text-center.font-bold.text-2xl {{ account.name || 'none' }}
  div {{ account }}
  div {{ user }}
  div setting
    ul
      li title
      li 设置主页语句列表
      li 是否使用 projech
      li (在功能页设置是否开启全局评论或本页评论)
  div 赞助此项目(bit eth)
  div 鸣谢 --列表(avatar+link)
  div.flex.justify-center
    button.px-12.py-2.bg-red-700.text-white.font-bold.rounded-full.shadow-lg.transition-all.duration-700(
      class="hover:shadow-none hover:bg-red-500 hover:text-white"
      @click="exit"
    ) sign out
</template>

<script setup>
const user = useCookie('sid')
const account = useState('account')
const router = useRouter()

const avatar_list = ref([])
const avatar_active = ref(0)

const avatar_click = (id) => {
  if (id === avatar_active.value) {
    avatar_active.value = avatar_active.value ? 0 : 1
  } else {
    console.log('上传修改头像')
  }
}

const exit = () => {
  fetch(`/api/session/${account.value.sid}`, {
    method: 'DELETE'
  }).then(res => {
    if (res.status === 200) {
      console.log('退出成功')
      account.value.sid = ''
      account.value.online = false
      router.push('/')
    } else {
      console.log('退出失败')
    }
  })
  account.online = false
}
</script>
