<template lang="pug">
div.flex.flex-col.pt-16.pb-4
  #PUBULIUBOX.relative
  //div.flex.flex-col.pt-16.pb-4(
  //  class="xl:(flex-row h-screen overflow-x-scroll) md:(px-12) lg:(px-12)"
  //)
  //  section.bg-dark-800.bg-opacity-20.rounded-md.p-12.m-2.min-w-64.flex.items-center.justify-center(v-if="account.online")
  //    label.w-24.h-24.bg-dark-600.bg-opacity-20.rounded-md
  //      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, null)")
  //  section(v-if="pending") Loading..
  //  section.m-2.p-4.bg-opacity-20.bg-dark-800.rounded-md.flex.flex-col.justify-center.items-center.relative(
  //    class="xl:(flex-wrap)"
  //    v-else
  //    v-for="item in data.list"
  //  )
  //    img.rounded-md.m-1(v-for="file in item.files" :src="`/api/image/${file.id}`")
  //    label.w-32.h-16.bg-dark-600.bg-opacity-20.rounded-md.flex.justify-center.items-center(v-if="account.online")
  //      span.font-bold.text-3xl.text-dark-800 upload
  //      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, item)")
  //    button.w-16.h-16.bg-dark-600.bg-opacity-20(v-if="account.online" @click="remove(item.id)") remove
</template>

<script>
export default {
  setup() {
    const account = useState('account')
    const { data, pending } = useFetch('/api/gallery')


    onMounted(() => {
      //var count = ''
      //var srcKey = 0
      //const list = []
      //const 预加载 = function(src, ImageIndex) {
      //  list.forEach((item, index) => {
      //    if (index < count) return
      //    if (!item[srcKey]) {
      //      //this.imgsArr[imgIndex]._height = '0'
      //      //this.loadedCount++
      //      //// 支持无图模式
      //      //if (this.loadedCount == this.imgsArr.length) {
      //      //  this.$emit('preloaded')
      //      //}
      //      //return
      //    }
      //    
      //  })
      //}
      //const 下拉事件 = function(element) {
      //  element.addEventListener('touchmove', (e) => {
      //    if (element.scrollTop === 0) {
      //      let t = e.changedTouches[0]
      //      if (!startY) startY = t.pageY
      //      let pullDownDistance = t.pageY - startY
      //      if (pullDownDistance > 0) {
      //        e.preventDefault()
      //      }
      //      //this.$emit('pullDownMove', pullDownDistance)
      //    }
      //  })
      //  element.addEventListener('touchend', (e) => {
      //    if (element.scrollTop === 0) {
      //      startY = NaN
      //      //this.$emit('pullDownEnd')
      //    }
      //  })
      //}
      // 数据
      const 可视区域 = { 宽度:0, 高度:0, 变化:false, 灵敏:100, 快照:NaN, 元素:null, 列数:1, 列宽:320, 边距: 0 }
      const 数据列表 = []
      const 热区元素 = []
      const 各列高度 = []

      //// 方法们
      //// 流程们
      ////const 加载数据 = function(src, index) {数据列表.forEach()} // 提前加载每个图片
      ////const 计算位置
      ////const 事件挂载
      //// 事件们
      const 取当前最小列 = function() {
        if (各列高度.length === 0) {
          for (let i=0; i<可视区域.列数; i++) {
            各列高度.push(120)
          }
        }
        let min = Math.min(...各列高度)
        let 列号 = 各列高度.indexOf(min)
        return {列号, 高度:min}
      }
      const 设置元素位置 = function(元素, 信息) {
        let 缩放比例 = 信息.宽度 / 可视区域.列宽
        let 建议图高 = 信息.高度 / 缩放比例
        let 最小列位置 = 取当前最小列()
        let 位置 = 可视区域.列宽 * 最小列位置.列号 + 可视区域.边距
        元素.style.top    = 最小列位置.高度 + 'px'
        元素.style.left   = 位置 + 'px'
        元素.style.width  = 可视区域.列宽 + 'px'
        元素.style.height = 建议图高 + 'px'
        元素.innerHTML    = `${最小列位置.列号}`
        各列高度[最小列位置.列号] = 最小列位置.高度 + 建议图高
      }
      const 热区添加元素 = function(信息) {
        let 元素 = document.createElement('div')
        元素.style.padding         = '1rem'
        元素.style.color           = '#FFFFFF'
        元素.style.fontWeight      = 'bold' 
        元素.style.backgroundColor = '#ff1414'
        元素.style.position        = 'absolute'
        元素.style.borderRadius    = '1rem'
        元素.style.border          = 'solid 1px #fff'
        元素.style.transition      = 'all .75s'
        设置元素位置(元素, 信息)
        可视区域.元素.appendChild(元素)
        热区元素.push({元素, 信息})
      }
      const 屏幕宽高重置 = function() {
        if (!可视区域.元素) {
          可视区域.元素 = document.body
        }
        console.log('window.devicePixelRatio', window.devicePixelRatio, 可视区域.元素.clientWidth)
        if (window.devicePixelRatio === 1 && 可视区域.元素.clientWidth > 1280) {
          可视区域.列宽 = 480
        } else {
          可视区域.列宽 = 320
        }
        if (各列高度.length) {
          各列高度.length = 0
        }
        可视区域.宽度 = 可视区域.元素.clientWidth
        可视区域.高度 = 可视区域.元素.clientHeight
        可视区域.列数 = parseInt(可视区域.宽度 / 可视区域.列宽) || 1
        可视区域.边距 = (可视区域.宽度 - (可视区域.列数 * 可视区域.列宽)) / 2
        // 热区重排(热区尚未优化, 先直接重排全部)
        热区元素.forEach(({元素, 信息}) => {
          设置元素位置(元素, 信息)
        })
      }
      //const 触发滚动事件 = function() {}
      //const 滚动触底事件 = function() {}
      //const 元素点击事件 = function() {}
      const 生成随机尺寸 = function(min, max) {
        const range = max - min + 1
        const rand  = Math.random()
        return min + Math.floor(rand * range)
      }

      window.onresize = function() {
        console.log('屏幕宽高重置')
        屏幕宽高重置()
      }

      setTimeout(() => {
        可视区域.元素 = document.querySelector('#PUBULIUBOX')
        屏幕宽高重置()
        // 模拟触发滚动事件
        for (let i=0; i<32; i++) {
          热区添加元素({
            宽度: 生成随机尺寸(120, 600),
            高度: 生成随机尺寸(240, 800)
          })
        }
      },"100")
      
    })

    return { data, pending, account }
  },
  methods: {
    async create() {
      return await $fetch(`/api/gallery`, {
        method:  'POST',
        headers: {"Content-Type": "application/json"},
        body:    {name:'default', data:'default'},
      })
    },
    async upload(event, item) {
      if (!item) {
        item = await this.create()
        item.files = []
        this.data.list.push(item)
      }
      // 上传, 目标位置如果是new则先创建获得id, 否则目标位置本就有id ✨
      let data = new FormData();
      let files = event.target.files
      for (let file of files) data.append("image", file)
      fetch(`/api/gallery/${item.id}`, {
        method: 'POST',
        body: data
      }).then(res => res.json()).then(data => {
        this.data.list.forEach(x => {
          if (x.id === item.id) {
            data.forEach(it => x.files.push(it))
          }
        })
      })
    },
    remove(id) {
      this.data.list = this.data.list.filter(item => item.id !== id)
      $fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    }
  }
}
</script>
