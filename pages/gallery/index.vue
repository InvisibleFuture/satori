<template lang="pug">
div.flex.flex-col
  .container.flex.justify-center.mx-auto.relative.top-24(v-if="account.online")
    label.w-48.h-24.bg-dark-600.bg-opacity-20.rounded-xl.cursor-pointer.flex.justify-center.items-center
      input.hidden(type="file", accept="image/*", multiple, @change="upload($event, null)")
      span.text-4xl.text-white +
  #PUBULIUBOX.relative
</template>

<script>
export default {
  async setup() {
    const account = useState('account')
    //const { data, pending } = useFetch('/api/gallery')
    const gallery = useState('gallery', () => ({
      editMode: false
    }))
    // data, pending,
    return { account, gallery }
  },
  beforeRouteLeave(to, form, next) {
    // 清除可能存在的旧元素
    document.querySelector('#PUBULIUBOX').innerHTML  = ''
    next()
  },
  async mounted() {
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
    const 从服务器删除文件 = function(id) {
      fetch(`/api/file/${id}`, {method:'DELETE'}).then(res => res.json()).then(data=>{
        console.log(data)
      })
    }
    ///// 数据们
    const 可视区域 = { 宽度:0, 高度:0, 变化:false, 灵敏:100, 快照:NaN, 元素:null, 列数:1, 列宽:320, 边距: 0, 间距: 8 }
    const 数据列表 = []
    var 热区元素 = []
    const 各列高度 = []
    ///// 方法们
    ///// 流程们
    ////const 加载数据 = function(src, index) {数据列表.forEach()} // 提前加载每个图片
    ////const 计算位置
    ////const 事件挂载
    ///// 事件们
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
      let 位置 = (可视区域.列宽 + 可视区域.间距) * 最小列位置.列号 + 可视区域.边距
      元素.style.top    = 最小列位置.高度 + 'px'
      元素.style.left   = 位置 + 'px'
      元素.style.width  = 可视区域.列宽 + 'px'
      元素.style.height = 建议图高 + 'px'
      各列高度[最小列位置.列号] = 最小列位置.高度 + 建议图高 + 可视区域.间距
    }
    const 热区添加元素 = function(信息) {
      let 元素 = document.createElement('div')
      元素.style.color           = 'rgba(24,24,24,.25)'
      元素.style.fontWeight      = 'bold' 
      元素.style.backgroundColor = 'rgba(24,24,24,.05)'
      元素.style.position        = 'absolute'
      元素.style.borderRadius    = '.25rem'
      元素.style.overflow        = 'hidden'
      元素.style.border          = 'solid 1px rgba(24,24,24,.25)'
      元素.style.transition      = 'all .75s'
      元素.onclick = function() {
        window.open('/api/image/'+信息.id)
        return false
      }
      //元素.innerHTML    = `${最小列位置.列号}`
      if (信息.网址) {
        let del = document.createElement('div')
        del.style.cssText = 'position:absolute;background:rgba(24,24,24,.25)'
        del.innerHTML = 'DEL'
        del.onclick = function() {
          var 下标 = 0 // 移除热列表中的, 然后触发重新排序
          热区元素.forEach((item, index) => {
            console.log(index, item.信息.id, 信息.id)
            if (item.信息.id === 信息.id) {
              下标 = index
              // 移除元素本身
              item.元素.parentNode.removeChild(item.元素)
              // 从服务器移除文件对象
              从服务器删除文件(item.信息.id)
            }
          })
          console.log(下标)
          热区元素.splice(下标, 1)
          屏幕宽高重置()
          return false
        }
        元素.appendChild(del)
        let img = document.createElement('img')
        img.src = 信息.网址
        元素.appendChild(img)
      }
      设置元素位置(元素, 信息)
      可视区域.元素.appendChild(元素)
      热区元素.push({元素, 信息})
    }
    const 屏幕宽高重置 = function() {
      if (!可视区域.元素) {
        可视区域.元素 = document.body
      }
      if (window.devicePixelRatio === 1 && 可视区域.元素.clientWidth > 1280) {
        可视区域.列宽 = 480
        可视区域.间距 = 16
      } else {
        可视区域.列宽 = 320
        可视区域.间距 = 8
      }
      if (各列高度.length) {
        各列高度.length = 0
      }
      可视区域.宽度 = 可视区域.元素.clientWidth
      可视区域.高度 = 可视区域.元素.clientHeight
      可视区域.列数 = parseInt(可视区域.宽度 / (可视区域.列宽 + 可视区域.间距)) || 1
      可视区域.边距 = (可视区域.宽度 - (可视区域.列数 * 可视区域.列宽) - ((可视区域.列数 - 1) * 可视区域.间距)) / 2
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

    // 初始载入元素
    await fetch('/api/gallery').then(res => res.json()).then(data => {
      //console.log(data)
      this.data = {}
      this.data.list = data.list
    })

    window.onresize = function() {
      屏幕宽高重置()
    }
    setTimeout(() => {
      可视区域.元素 = document.querySelector('#PUBULIUBOX')
      可视区域.元素.innerHTML  = '' // 清除可能存在的旧元素
      屏幕宽高重置()
      this.data.list.forEach(item => {
        item.files.forEach(img => {
          热区添加元素({
            宽度: img.width  || 480,
            高度: img.height || 600,
            网址: '/api/image/' + img.id + '.webp',
            id: img.id
          })
        })
      })
      // 模拟触发滚动事件
      //for (let i=0; i<32; i++) {
      //  热区添加元素({
      //    宽度: 生成随机尺寸(120, 600),
      //    高度: 生成随机尺寸(240, 800)
      //  })
      //}
    },"100")
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
