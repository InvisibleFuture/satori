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
</template>

<script setup>

const list = []

</script>
