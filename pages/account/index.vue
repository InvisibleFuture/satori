<template lang="pug">
div.container.mx-auto.p-24.text-white
  div.relative.h-32.w-48.mx-auto
    div.absolute.rounded-full.w-32.h-32.left-0.top-0.bg-gray-200.transition-all.duration-700(
      :class="{'left-16': avatar_active === 1, 'z-10': avatar_active === 1}"
      @click="avatar_click(0)"
    )
    div.absolute.rounded-full.w-32.h-32.left-0.top-0.bg-gray-600.transition-all.duration-700(
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
</template>

<script>
export default {
  setup() {
    const user = useCookie('sid')
    const account = useState('account')
    return { account, user }
  },
  data: () => ({
    avatar_list: [],
    avatar_active: 0,
  }),
  methods: {
    avatar_click(id) {
      if (id === this.avatar_active) {
        console.log('交换头像')
        this.avatar_active = this.avatar_active ? 0 : 1
      }
      console.log('上传修改头像')
    },
  }
}
</script>
