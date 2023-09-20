<template lang="pug">
.container.mx-auto.pt-32
  // 发布页(只含成品作品的发布)
  div
    ul.flex
      li.p-4(v-for="item in list" :key="item.name")
        div {{ item.name }}
        ol.list-decimal(start="1")
          li(v-for="i in item.list" :key="i.name") {{ i.name }}

  //// 文章数, 评论数, 活跃状态
  //div
  //  h1.text-xl.text-gray-600.font-bold 文章数, 评论数, 活跃状态
  //  ul
  //    li 文章数: {{ 0 }}
  //    li 评论数: {{ 0 }}
  //    li 活跃状态: {{ 0 }}
  // 统计(访问量)
  div
    div.rounded-lg.bg-gray-300.bg-opacity-10.p-4.h-80.w-60vw.mx-auto.flex.justify-center
      canvas#myChart(style="width: 100%; height: 100%")
    //div
    //  button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeDay") 切换为一天的访问量
    //  button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeWeek") 切换为一周的访问量
    //  button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeMonth") 切换为一月的访问量

  //### 远程办公
  //1. 离开办公室走进咖啡厅, 你缺少什么?
  //    成本损耗, 效益加成: 咖啡厅显著提高了成本, 但未加成效率
  //2. 为什么缺少? 如何补足?
</template>

<script setup>
import Chart from 'chart.js/auto'
import { onMounted } from 'vue'

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

var data = null
var chart = null

// 展示本周的访问量
const week = {
  0: '周日',
  1: '周一',
  2: '周二',
  3: '周三',
  4: '周四',
  5: '周五',
  6: '周六',
}

onMounted(async () => {
  // 获取昨天的访问量
  const 昨天的时间戳 = new Date().getTime() - 24 * 60 * 60 * 1000
  const 昨天的日期 = new Date(昨天的时间戳).toISOString().slice(0, 10)
  console.log(昨天的日期)
  const 昨天的访问量 = await $fetch(`/api/statistics/http/day?day=${昨天的日期}`)

  // 获取今天的访问量
  const counts = await $fetch('/api/statistics/http/day')
  console.log(counts)
  const hour = new Date().getHours()
  chart = new Chart(document.querySelector('#myChart'), {
    type: 'line',
    data: {
      labels: Object.keys(counts).map(item => item),
      datasets: [
        {
          label: '今日访问量'+Object.values(counts).map(item => item).reduce((a,b)=>a+b,0),
          data: Object.values(counts).map(item => item),
          spanGaps: true,
          borderWidth: 2,
          fill: true,
          tension: 0.3
        },
        {
          label: '昨日访问量'+Object.values(昨天的访问量).map(item => item).reduce((a,b)=>a+b,0),
          data: Object.values(昨天的访问量).map(item => item),
          spanGaps: true,
          borderWidth: 2,
          fill: true,
          tension: 0.3
        },
      ]
    },
    // 为当前时间 hour 设置截断线
    options: {
      plugins: {
        annotation: {
          annotations: [
            {
              type: 'line',
              mode: 'vertical',
              scaleID: 'x',
              value: new Date().toISOString().slice(0, 10),
              borderColor: 'red',
              borderWidth: 2,
              label: {
                content: 'Today',
                enabled: true,
                position: 'top',
              }
            },
          ],
        },
      },
      scales: {
        x: {
          ticks: {
            callback: (value, index, values) => {
              return (index === hour) ? '(当前) ' + value : value
            }
          }
        }
      }
    }
  })
})

onUnmounted(() => {
  chart.destroy()
})

// 点击切换为一天的访问量
const changeDay = () => {
  // 重建数据, 使图表以24小时为单位, 从0点开始, 逐小时递增, 每天作为一个数据集显示为一条线
  chart.data.labels = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`)
  chart.data.datasets = Object.keys(data.days).map(key => {
    const item = data.days[key]
    const date = new Date(key)
    return {
      label: `${date.toLocaleDateString().replace(/\d{4}年/, '')} ${week[date.getDay()]}`,
      data: item.map(x => x.count),
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    }
  })
  chart.update()
}

// 点击切换为一周的访问量
const changeWeek = () => {
  // 重建数据, 使图表以7天为单位, 从周日开始, 逐天递增, 每周作为一个数据集显示为一条线
  chart.data.labels = Array.from({ length: 7 }, (_, i) => week[i])
  chart.data.datasets = Object.keys(data.weeks).map(key => {
    const item = data.weeks[key]
    return {
      label: week[key],
      data: item.map(x => x.count),
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    }
  })
  chart.update()
}

// 点击切换为一月的访问量
const changeMonth = () => {
  // 重建数据, 使图表以30天为单位, 从1号开始, 逐天递增, 每月作为一个数据集显示为一条线
  chart.data.labels = Array.from({ length: 30 }, (_, i) => i + 1)
  chart.data.datasets = Object.keys(data.months).map(key => {
    const item = data.months[key]
    return {
      label: `${key + 1}月`,
      data: item.map(x => x.count),
      borderWidth: 2,
      fill: true,
      tension: 0.3,
    }
  })
  chart.update()
}
</script>
