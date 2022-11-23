<template lang="pug">
.flex.flex-col
  .relative.mt-24.transition-opacity.duration-700.ease-in-out(
    ref="PUB",
    v-if="!pending",
    :class="{ 'opacity-100': !pending, 'opacity-10': pending }"
  )
    template(v-for="item in data.list")
      .absolute.transition-all.duration-700.ease-in-out.left-0.top-0.bg-gray-100(
        :data-w="item.width",
        :data-h="item.height",
        class="hover:bg-gray-200"
      )
        img.w-full(:src="item.image")
        .absolute.top-0.left-0.right-0.text-white.overflow-hidden.break-words.pb-4(
          style="background: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.25))"
        )
          p.p-2 {{ item.width }} x {{ item.height }}
</template>

<script setup>
const account = useState("account");
const { data, pending, refresh } = useFetch("/api/gallery?page=1&pageSize=40");
const PUB = ref(null);

const 屏幕宽高重置 = () => {
  let 各列高度 = [];
  let 容器宽度 = document.body.clientWidth;
  let 高分屏 = window.devicePixelRatio === 1 && 容器宽度 > 1280;
  let 列宽 = 高分屏 ? 480 : 320;
  let 间距 = 高分屏 ? 16 : 8;
  let 列数 = parseInt(容器宽度 / (列宽 + 间距)) || 1;
  let 边距 = (容器宽度 - 列数 * 列宽 - (列数 - 1) * 间距) / 2;
  for (let i = 0; i < 列数; i++) {
    各列高度.push(0);
  }
  let 元素集 = PUB.value;
  for (let item of 元素集?.children || []) {
    let 最低 = Math.min(...各列高度);
    let 列号 = 各列高度.indexOf(最低);
    let 位置 = (列宽 + 间距) * 列号 + 边距;
    let 元素宽 = parseInt(item.getAttribute("data-w"));
    let 元素高 = parseInt(item.getAttribute("data-h"));
    let 缩放比 = 元素宽 / 列宽;
    let 缩放高 = parseInt(元素高 / 缩放比);
    item.style.top = 最低 + "px";
    item.style.left = 位置 + "px";
    item.style.width = 列宽 + "px";
    item.style.height = 缩放高 + "px";
    // 加高
    各列高度[列号] += 缩放高 + 间距;
  }
};

const english = ref(false); // 英语
const disabled = ref(false); // 上锁
const inadvance = ref(400); // 距离
const page = ref(3); // 页码

const nextPage = () => {
  fetch(`/api/text?page=${page.value}`).then((res) => {
    page.value = page.value + 1;
    disabled.value = false;
    if (res.status === 200) {
      res.json().then((rest) => {
        console.log(rest);
        rest.list.forEach((item) => {
          if (!item.width || !item.height) {
            console.log("没有宽高");
            let img = new Image();
            img.src = item.image;
            img.onload = () => {
              console.log("width:" + img.width + ",height:" + img.height);
              item.width = img.width;
              item.height = img.height;
            };
          }
        });
        data.value.list = data.value.list.concat(rest.list);
      });
    }
  });
};

const handleScroll = () => {
  if (disabled.value) return;
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
  if (scrollHeight - scrollTop - clientHeight <= inadvance.value) {
    console.log("scroll to bottom");
    disabled.value = true; // 加载期间上锁
    inadvance.value = 1280; // 加高判定值使卡顿感减弱
    nextPage();
  }
};

onBeforeUnmount(() => {
  document.removeEventListener("scroll", handleScroll);
});

onMounted(() => {
  console.log("mounted");
  屏幕宽高重置();
  window.onresize = 屏幕宽高重置;
  document.addEventListener("scroll", handleScroll);
});

onUpdated(() => {
  console.log("updated:检查未排序的元素");
  屏幕宽高重置();
});

const create = async () => {
  return await $fetch(`/api/gallery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { name: "default", data: "default" },
  });
};

const upload = async (event, item) => {
  if (!item) {
    item = await this.create();
    item.files = [];
    this.data.list.push(item);
  }
  // 上传, 目标位置如果是new则先创建获得id, 否则目标位置本就有id ✨
  let data = new FormData();
  let files = event.target.files;
  for (let file of files) data.append("image", file);
  fetch(`/api/gallery/${item.id}`, {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      this.data.list.forEach((x) => {
        if (x.id === item.id) {
          data.forEach((it) => x.files.push(it));
        }
      });
    });
};
</script>
