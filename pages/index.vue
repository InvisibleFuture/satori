<template lang="pug">
.container.mx-auto.pt-32
  // 主页: 发布页(只含成品作品的发布)
  div
    h1.text-xl.text-gray-600.font-bold 主页: 发布页(只含成品作品的发布)
    ul
      li 远程协作组队
      li 更好的设想机
      li 私有的信息库
      li 可控个人助理
  // 文章数, 评论数, 活跃状态
  div
    h1.text-xl.text-gray-600.font-bold 文章数, 评论数, 活跃状态
    ul
      li 文章数: {{ 0 }}
      li 评论数: {{ 0 }}
      li 活跃状态: {{ 0 }}
  // 统计(访问量)
  div
    h1.text-xl.text-gray-600.font-bold 统计(访问量)
    div.rounded-lg.bg-gray-300.bg-opacity-10.p-4
      canvas#myChart(width="400" height="200")
</template>

<script setup>
import Chart from 'chart.js/auto'
import { onMounted } from 'vue'

var chart = null

onMounted(async () => {
  const ctx = document.getElementById('myChart')
  const data = await fetch('/api/statistics/http').then(res => res.json())
  console.log(data)
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`),
      datasets: Object.keys(data.days).map(key => {
        const item = data.days[key]
        const date = new Date(key)
        return {
          label: `${date.toLocaleDateString().replace(/\d{4}年/, '')} ${week[date.getDay()]}`,
          data: item.map(x=>x.count),
          borderWidth: 2,
          fill: true,
          tension: 0.3,
        }
      }),
    },
  })
})

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

const setChart = () => {
  const ctx = document.getElementById('myChart')
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      // 0点到23点生成24个小时的数据
      labels: Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' + i : i}:00`),
      //Object.keys(data.time).map(key=>{
      //  const date = new Date(key)
      //  const hour = date.getHours()
      //  return `${hour < 10 ? '0' + hour : hour}:00`
      //}),
      //datasets: [{
      //  label: '访问量',
      //  data: Object.keys(data.time).map(key => data.time[key]),
      //  backgroundColor: 'rgba(255, 99, 132, 0.2)',
      //  borderColor: 'rgba(255, 99, 132, 1)',
      //  borderWidth: 2,
      //  fill: true,
      //  tension: 0.3,
      //}],
    },
  })
}


</script>
