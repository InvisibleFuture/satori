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
          class="focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
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
        ) 发布 (Ctrl+Enter)
    div.flex.flex-col.gap-0.p-6(
      v-for="item in data.filter(x=>x.title?.length < 6)", :key="item.id" tabindex="0"
      :class="{'bg-gray-100': select_items.includes(item)}"
      @click="event => selectItem(event,item)"
    )
      div.markdown(v-html="item.html")
      div.flex.gap-4.text-gray-500.text-xs
        time {{ rwdate(item.updatedAt || item.createdAt) }} {{ !item.updatedAt ? '创建' : '最后更新' }}
        button(@click.stop="comments.show(item.id)") 评论
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
      template(v-for="item in data.filter(x=>x.title?.length >= 6)" :key="item.id")
        NuxtLink.block(
          class="hover:text-pink-500"
          :to="`/blog/${item.id}`"
        ) {{ item.title }}
  // 弹出层编辑器(编辑日志)
  div.fixed.top-0.bottom-0.left-0.right-0.backdrop-filter.backdrop-saturate-150(
    v-if="editor.edit_mode"
    @click="editor.edit_mode = false"
    @keyup.esc="editor.edit_mode = false"
    class="bg-white bg-opacity-0 transition-all duration-250 backdrop-blur-md"
  )
    div.container.mx-auto.my-12
      textarea#editor.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150.min-h-xl.mb-4(
        class="focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
        v-model="editor.item.content",
        placeholder="写点什么呢",
        @keydown.ctrl.enter.prevent="editor.submit()"
        @click.stop
      )
  // 弹出层编辑器(发表评论)
  div.fixed.top-0.bottom-0.left-0.right-0.backdrop-filter.backdrop-saturate-150(
    v-if="dialog.visible"
    @click="dialogShow()"
    @keyup.esc="dialogShow()"
    tabindex="0"
    ref="dialogRef"
    class="bg-white bg-opacity-0 transition-all duration-250 backdrop-blur-md"
    :class="{'opacity-100': dialog.show, 'opacity-0': !dialog.show}"
  )
    div.container.mx-auto.my-12.p-4.transition-all.duration-250(@click.stop)
      // 主题区
      div(v-html="comments.item.html")
      // 评论区
      div.py-2(v-for="item in comments.item.comments", :key="item.id")
        div.flex.gap-2
          img.h-8.w-8.rounded-full.object-cover(src="/avatar.jpeg" alt="Last")
          div
            p {{ item.content }}
            div.flex.gap-2.text-gray-500.text-xs
              span Last
              time(:datetime="item.updatedAt || item.createdAt") {{ rwdate(item.updatedAt ? item.updatedAt : item.createdAt) }} {{ item.updatedAt ? '最后更新' : '创建' }}
      // 编辑器
      textarea.w-full.rounded-md.border-gray-300.shadow-sm.px-6.py-4.transition-all.duration-150.min-h-xl.mb-4(
        class="focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
        v-model="comments.edit.content",
        placeholder="写点什么呢",
        @keydown.ctrl.enter.prevent="comments.submit()"
        @click.stop
      )
</template>

<script setup>
const { data, pending } = useFetch("/api/blog", { immediate: true });
const router = useRouter();
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
      body: JSON.stringify({ content: this.item.content }),
      Headers: { "Content-Type": "application/json" }
    }).then(data => {
      console.log('editItem', data);
      this.item.html = data.html
      this.item.createdAt = data.createdAt
      this.item.updatedAt = data.updatedAt
      this.edit_mode = false
    });
  }
})

// 在显示组件后才触发class变化
const dialog = ref({ show: false, visible: false })
const dialogRef = ref()
const dialogShow = () => {
  if (dialog.value.visible && dialog.value.show) {
    dialog.value.show = false
    setTimeout(() => dialog.value.visible = false, 250)
  } else {
    dialog.value.visible = true                   // 显示弹出层
    setTimeout(() => dialog.value.show = true, 0) // 等待渲染后再显示
    nextTick(() => dialogRef.value.focus())       // 弹出层自动聚焦
  }
}

// 展示组件
const comments = ref({
  edit: { id: '', content: '' },
  item: computed(() => data.value.find(x => x.id === comments.value.edit.id)),
  // 提交评论内容
  async submit() {
    const { id, ...body } = comments.value.edit
    const rest = await $fetch(`/api/blog/${id}/comments`, {
      method: "POST",
      body: JSON.stringify(body),
      Headers: { "Content-Type": "application/json" }
    })
    console.log('create:', rest);
    this.item.comments.unshift(rest)
  },
  // 展示 bolg 详情
  async show(id) {
    comments.value.edit.id = id
    dialogShow()
  }
})

// 转换时间格式
const rwdate = (utc) => {
  let t = new Date(utc);
  return t.getMonth() + 1 + "月 " + t.getDate() + ", " + t.getFullYear();
}

const create = (event) => {
  $fetch("/api/blog", {
    method: "POST",
    body: JSON.stringify({ content: content.value }),
    Headers: { "Content-Type": "application/json" }
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
  // 如果是按住ctrl键, 则是多选操作(点击已经选中的则取消选中, 点击未选中的则选中)
  if (event.ctrlKey && account.value.online) {
    return select_items.value.includes(item) ? __unselect_item(item) : __select_item(item);
  }
  // 清空多选, 然后打开详情页
  select_items.value.forEach((item) => __unselect_item(item));
  router.push(`/blog/${item.id}`);
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
