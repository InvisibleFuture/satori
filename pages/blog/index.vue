<template lang="pug">
div.container.mx-auto.py-32.px-16.flex.flex-col.gap-2
  div.flex.flex-col.gap-6(v-if="account.online")
    // 一个精致的markdown所见即所得输入框(宽高过渡动画)
    textarea.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150(
      class="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none",
      v-model="content",
      placeholder="写点什么呢",
      @keydown.ctrl.enter.prevent="create"
      @keydown.enter="onEnter"
      @change="onChanged"
    )
  div.flex.flex-col.gap-6.p-6(
    v-for="item in data", :key="item.id" tabindex="0"
    :class="{'bg-gray-100': select_items.includes(item)}"
    @click="event => selectItem(event,item)"
  )
    div.markdown(v-html="item.html")
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
const content = ref("");
const account = useState("account");

const rwdate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
};

const create = (event) => {
  $fetch("/api/blog", {
    method: "POST",
    body: JSON.stringify({content: content.value}),
    Headers: {"Content-Type": "application/json"}
  }).then(item => {
    console.log('create', item);
    data.value.unshift(item)
    content.value = ''
    const textarea = event.target; // 恢复输入框高度
    textarea.style.height = textarea.scrollHeight + 'px';
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


// 被选中的列表
const select_items = ref([]);

// 选中某项(隐藏视焦外的元素)
const __select_item = (item) => {
  select_items.value.push(item);
  document.querySelectorAll('header.header, textarea').forEach((item) => {
    item.classList.add('opacity-0');
    item.classList.add('pointer-events-none');
  });
};

// 取消选中某项(无选项时, 恢复显示视焦外的元素)
const __unselect_item = (item) => {
  select_items.value = select_items.value.filter(i => i !== item);
  if (select_items.value.length === 0) {
    document.querySelectorAll('header.header, textarea').forEach((item) => {
      item.classList.remove('opacity-0');
      item.classList.remove('pointer-events-none');
    });
  }
};

// 点击某项时, 选中或取消选中
const selectItem = (event, item) => {
  // 如果已经选中, 则取消选中
  if (select_items.value.includes(item)) {
    return __unselect_item(item);
  }
  // 如果不是多选, 取消已经选中的(按住ctrl键时为多选)
  if (!event.ctrlKey) {
    select_items.value.forEach((item) => __unselect_item(item));
  }
  // 并选中当前 item
  __select_item(item);
};

// 监听键盘事件
const __keydown_all = (event) => {
  // 如果有选中的 item, 则删除选中的 item
  if (event.key === "Delete") {
    if (select_items.value.length > 0) {
      data.value = data.value.filter((item) => {
        return !select_items.value.includes(item);
      });
      select_items.value.forEach((item) => {
        $fetch(`/api/blog/${item.id}`, {
          method: "DELETE",
        }).then((data) => {
          console.log("delete", data);
        });
      });
      select_items.value.forEach((item) => {
        __unselect_item(item);
      });
    }
  }
  // 如果有选中的 item, 则取消选中的 item
  if (event.key === "Escape") {
    select_items.value.forEach((item) => {
      __unselect_item(item);
    });
  }
};

// 挂载监听器, 监听键盘 delete 键
onMounted(() => {
  window.addEventListener("keydown", __keydown_all);
});

// 卸载监听器
onUnmounted(() => {
  window.removeEventListener("keydown", __keydown_all);
});

</script>
