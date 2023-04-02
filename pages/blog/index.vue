<template lang="pug">
main.container.mx-auto.py-24.flex.gap-8(
  class=">sm:px-16 >sm:py-32"
  v-if="!pending"
)
  div.flex.flex-1.flex-col.gap-2
    div.flex.flex-col.gap-6.p-6(v-if="account.online")
      // 一个精致的markdown所见即所得输入框(宽高过渡动画)
      div.create-blog
        textarea.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150(
          class="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none",
          v-if="account.online"
          v-model="content",
          placeholder="写点什么呢",
          @keydown.ctrl.enter.prevent="create"
          @keydown.enter="onEnter"
          @change="onChanged"
        )
        button.px-8.py-1.bg-light-blue-100.text-light-blue-400.rounded-lg.transition-all(
          class="hover:bg-light-blue-50"
          v-if="content.length > 0", @click="create"
        ) 发布
    div.flex.flex-col.gap-0.p-6(
      v-for="item in data.filter(x=>x.title.length < 6)", :key="item.id" tabindex="0"
      :class="{'bg-gray-100': select_items.includes(item)}"
      @click="event => selectItem(event,item)"
    )
      div.markdown(v-html="item.html")
      div.mb-6.flex.gap-4.text-gray-500.text-xs
        time {{ rwdate(item.createdAt) }} 创建
        time(v-if="item.createdAt !== item.updatedAt") {{ rwdate(item.updatedAt) }} 最后更新
      div.flex.flex-col.gap-2
        div.flex.gap-2
          img.h-8.w-8.rounded-full.object-cover(src="/avatar.jpeg" alt="Last")
          div
            p hahahah
            div.flex.gap-2.text-gray-500.text-xs
              span Last
              span 2021-08-08 12:12:12
        div.text-green-500 展开12个讨论..
  aside.w-64.py-2.flex.flex-col.gap-8(class="<sm:hidden")
    div
      span.font-bold # TAG
      ul.flex.flex-wrap.gap-2.py-1
        li.bg-gray-400.bg-opacity-10.px-2.rounded-md.cursor-pointer.overflow-clip(
          class="hover:text-pink-500"
          v-for="item in ['vue','react','node']"
          :key="item"
        ) {{ item }}
    div.flex.flex-col.gap-2
      span.font-bold # 归档
      template(v-for="item in data.filter(x=>x.title.length >= 6)" :key="item.id")
        NuxtLink.block(
          class="hover:text-pink-500"
          :to="`/blog/${item.id}`"
        ) {{ item.title }}
  // 弹出层编辑器
  div.fixed.bg-green-300.top-0.bottom-0.left-0.right-0(v-if="editor.edit_mode" @click="editor.edit_mode = false" @keyup.esc="editor.edit_mode = false")
    div.container.mx-auto.my-12
      textarea#editor.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150.min-h-xl.mb-4(
        class="focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 focus:outline-none",
        v-model="editor.item.content",
        placeholder="写点什么呢",
        @keydown.ctrl.enter.prevent="editor.submit()"
        @click.stop
      )
</template>

<script setup>
const { data, pending } = useFetch("/api/blog", { immediate: true });
const content = ref("");
const account = useState("account");
const editor = ref({
  edit_mode: false,
  item: {
    id: '',
    content: '',
    createdAt: '',
  },
  submit() {
    $fetch(`/api/blog/${this.item.id}`, {
      method: "PATCH",
      body: JSON.stringify({content: this.item.content}),
      Headers: {"Content-Type": "application/json"}
    }).then(data => {
      console.log('editItem', data);
      this.item.html = data.html
      this.edit_mode = false
    });
  }
});

// 转换时间格式
const rwdate = (utc) => {
    let t = new Date(utc);
    return t.getMonth() + 1 + "月 " + t.getDate() + ", " + t.getFullYear();
}

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
  document.querySelectorAll('header.header, .create-blog').forEach((item) => {
    item.classList.add('opacity-0');
    item.classList.add('pointer-events-none');
  });
};

// 取消选中某项(无选项时, 恢复显示视焦外的元素)
const __unselect_item = (item) => {
  select_items.value = select_items.value.filter(i => i !== item);
  if (select_items.value.length === 0) {
    document.querySelectorAll('header.header, .create-blog').forEach((item) => {
      item.classList.remove('opacity-0');
      item.classList.remove('pointer-events-none');
    });
  }
};

// 点击某项时, 选中或取消选中
const selectItem = (event, item) => {
  if (!account.value.online) {
    return console.log('登录后可以操作')
  }
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
  // 如果有选中的 item, 且只有一个 item, 则编辑该 item
  if (event.key === "e" && !editor.value.edit_mode) {
    if (select_items.value.length === 1) {
      editor.value.item = select_items.value[0];
      editor.value.edit_mode = true;
      // 渲染后, 聚焦到编辑器
      setTimeout(() => {
        document.querySelector('textarea#editor').focus();
      }, 0);
    }
  }
};

// 挂载监听器, 监听键盘 delete 键
onMounted(() => {
  window.addEventListener("keydown", __keydown_all);
});

// 卸载监听器(离开时恢复隐藏内容)
onUnmounted(() => {
  window.removeEventListener("keydown", __keydown_all);
  document.querySelectorAll('header.header, .create-blog').forEach((item) => {
    item.classList.remove('opacity-0');
    item.classList.remove('pointer-events-none');
  });
});

</script>
