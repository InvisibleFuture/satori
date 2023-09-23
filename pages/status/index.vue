<template lang="pug">
.container.mx-auto.pt-32
  div.rounded-lg.bg-gray-300.bg-opacity-10.p-4.h-80.w-60vw.mx-auto.flex.justify-center
    canvas#myChart(style="width: 100%; height: 100%")
    // button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeDay") 切换为一天的访问量
    // button.bg-light-blue-600.mx-2.text-white.rounded-md(@click="changeWeek") 切换为一周的访问量
</template>

<script setup>
import Chart from 'chart.js/auto'
import { onMounted, onUnmounted } from 'vue'

var chart = null

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

</script>
