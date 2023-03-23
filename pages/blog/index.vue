<template lang="pug">
div.container.mx-auto.py-32.px-16.flex.flex-col.gap-2
  div.whitespace-pre.flex.flex-col.gap-6(v-if="account.online")
    // 一个精致的markdown所见即所得输入框(宽高过渡动画)
    textarea.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150.ease-linear.delay-150(
      class="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none",
      v-model="content",
      placeholder="写点什么呢",
      @keydown.ctrl.enter.prevent="create"
      @keydown.enter="onEnter"
      @change="onChanged"
    )

  div.whitespace-pre.flex.flex-col.gap-6.p-6(v-for="item in data", :key="item.id" tabindex="0" @click="select(item)" :class="{'bg-gray-100': select_items.includes(item)}")
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
const select_items = ref([]);
const content = ref("");
const account = useState("account");

const rwdate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
};

const create = () => {
  $fetch("/api/blog", {
    method: "POST",
    body: JSON.stringify({content: content.value}),
    Headers: {"Content-Type": "application/json"}
  }).then(item => {
    console.log('create', item);
    data.value.unshift(item)
    content.value = ''
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

const select = (item) => {
  console.log('select', item);
  if (select_items.value.includes(item)) {
    select_items.value = select_items.value.filter(i => i !== item);
  } else {
    select_items.value.push(item);
  }
};

</script>
