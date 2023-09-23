<template lang="pug">
.container.mx-auto.pt-32
  div.h-screen.bg-opacity-50.rounded-lg
    div.flex.justify-center.items-center.h-full.relative
      // 太极
      div(class="rounded-full h-64 w-64 absolute overflow-hidden")
        div(class="bg-white h-1/1 left-0 w-1/2 absolute")
        div(class="bg-black h-1/1 right-0 w-1/2 absolute")
        div(class="bg-white rounded-full h-32 top-0 left-1/4 w-32 absolute flex justify-center items-center")
          div(class="bg-black rounded-full h-8 w-8")
        div(class="bg-black rounded-full h-32 bottom-0 right-1/4 w-32 absolute flex justify-center items-center")
          div(class="bg-white rounded-full h-8 w-8")
      // 八个卦相
      div(class="flex h-82 w-82 absolute justify-center items-center overflow-hidden")
        div(
          v-for="item, index in ['乾','巽','坎', '艮','坤','震','離','兑']" :key="item"
          class="flex flex-col h-1/1 w-1/1 absolute items-center"
          :style="{ transform: `rotate(${index * 45}deg)` }"
        )
          span {{ item }}
      // 六十四卦
      div(
        class="flex bg-green-500 bg-opacity-0 h-256 w-256 absolute justify-center items-center overflow-hidden"
      )
        div(
          v-for="item, i in ['坤', '剝', '比', '觀', '豫', '晉', '萃', '否', '謙', '艮', '蹇', '漸', '小過', '旅', '咸', '遯', '師', '蒙', '坎', '渙', '解', '未濟', '困', '訟', '升', '蠱', '井', '巽', '恆', '鼎', '大過', '姤', '復', '頤', '屯', '益', '震', '噬嗑', '隨', '無妄', '明夷', '賁', '既濟', '家人', '豐', '離', '革', '同人', '臨', '損', '節', '中孚', '歸妹', '睽', '兌', '履', '泰', '大畜', '需', '小畜', '大壯', '大有', '夬', '乾']" :key="item"
          class="flex flex-col h-1/1 w-1/1 absolute items-center"
          :style="{ transform: `rotate(${i * (360/64)}deg)` }"
        )
          span {{ item }}
          span {{ i % 2 < 1 ? '- -' : '---' }}
          span {{ i % 4 < 2 ? '- -' : '---' }}
          span {{ i % 8 < 4 ? '- -' : '---' }}
          span {{ i % 16 < 8 ? '- -' : '---' }}
          span {{ i % 32 < 16 ? '- -' : '---' }}
          span {{ i % 64 < 32 ? '- -' : '---' }}

  // 子元素围绕中心点旋转, 组成64卦
  // 发布页(只含成品作品的发布)
  div
    ul.flex
      li.p-4(v-for="item in list" :key="item.name")
        div {{ item.name }}
        ol.list-decimal(start="1")
          li(v-for="i in item.list" :key="i.name") {{ i.name }}
  div
    div.rounded-lg.bg-gray-300.bg-opacity-10.p-4.h-80.w-60vw.mx-auto.flex.justify-center
      canvas#myChart(style="width: 100%; height: 100%")
      // button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeDay") 切换为一天的访问量
      // button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeWeek") 切换为一周的访问量
      //### 远程办公
      //1. 离开办公室走进咖啡厅, 你缺少什么?
      //    成本损耗, 效益加成: 咖啡厅显著提高了成本, 但未加成效率
      //    咖啡厅加成了什么? 状态氛围
      //2. 为什么缺少? 如何补足?
      // 文章数, 评论数, 活跃状态
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
  // 获取昨天的访问量(东八区时间, 24小时前)
  const 昨天的时间戳 = new Date().getTime() + (8 - 24) * 60 * 60 * 1000
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
          label: '今日访问量' + Object.values(counts).map(item => item).reduce((a, b) => a + b, 0),
          data: Object.values(counts).map(item => item),
          spanGaps: true,
          borderWidth: 2,
          fill: true,
          tension: 0.3
        },
        {
          label: '昨日访问量' + Object.values(昨天的访问量).map(item => item).reduce((a, b) => a + b, 0),
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
