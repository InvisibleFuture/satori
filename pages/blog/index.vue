<template lang="pug">
div.container.mx-auto.py-32.px-16.flex.flex-col.gap-8
  div.whitespace-pre.flex.flex-col.gap-6
    // 一个精致的markdown所见即所得输入框(宽高过渡动画)
    textarea.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150.ease-linear.delay-150(
      class="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none",
      v-model="content",
      placeholder="写点什么呢",
      @keydown.ctrl.enter.prevent="create"
      @keydown.enter="onEnter"
      @change="onChanged"
    )

  div.whitespace-pre.flex.flex-col.gap-6(v-for="item in data", :key="item.id")
    div {{ item.content }}
    div.flex.flex-col.gap-2
      div.flex.gap-2
        img.h-8.w-8.rounded-full.object-cover(src="/avatar.jpeg" alt="Last")
        div
          p hahahah
          div.flex.gap-2.text-gray-500.text-xs
            span Last
            span 2021-08-08 12:12:12
      div.text-green-500 展开12个讨论..
</template>

<script setup>
const { data, pending } = useFetch("/api/blog");
const rwdate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
};
const content = ref("");

const create = () => {
  $fetch("/api/blog", {
    method: "POST",
    body: JSON.stringify({content: content.value}),
    Headers: {"Content-Type": "application/json"}
  }).then(item => {
    console.log('create', item);
    data.value.unshift(item)
  });
};

const onChanged = () => {
  console.log('onChanged', content.value);
};

// 获取 textarea 中的内容高度, 并使输入框高度跟随内容高度变化
const onEnter = (event) => {
  const textarea = event.target;
  textarea.style.height = textarea.scrollHeight + 'px';
  return true
};

</script>
