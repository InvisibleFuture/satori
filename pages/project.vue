<template lang="pug">
div
  // 子元素围绕中心点旋转, 组成64卦
  //// 发布页(只含成品作品的发布)
  //div
  //  ul.flex
  //    li.p-4(v-for="item in list" :key="item.name")
  //      div {{ item.name }}
  //      ol.list-decimal(start="1")
  //        li(v-for="i in item.list" :key="i.name") {{ i.name }}
  //### 远程办公
  //1. 离开办公室走进咖啡厅, 你缺少什么?
  //    成本损耗, 效益加成: 咖啡厅显著提高了成本, 但未加成效率
  //    咖啡厅加成了什么? 状态氛围
  //2. 为什么缺少? 如何补足?
  // 文章数, 评论数, 活跃状态
</template>

<script setup>

const list = [
  {
    name: '远程协作组队',
    icon: '',
    list: [
      { name: '调度交换', info: '提高效率,提高速度,摆脱束缚' },
      { name: '最佳匹配', info: '' },
      { name: '远程活性', info: '即时通信' },
      { name: '组织结构', info: '讨论组,数据集,任务管理,执行跟进,架构分层,主动参与的,摆脱平台束缚的, 完全自主控制的, 项目推进与实施' },
      { name: '有效行为', info: '邀请加入,业务引流, 交换数据, 公开信息, 招募成员' },
      { name: '组织收益', info: '' },
      { name: '', info: '' },
      { name: '', info: '' },
    ]
  },
  { name: '更好的设想机', icon: '', list: [] },
  { name: '私有的信息库', icon: '', list: [] },
  { name: '可控个人助理', icon: '', list: [] },
]

</script>
