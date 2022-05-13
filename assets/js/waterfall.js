export default class waterfall {
  constructor({ element, spacing=8, margin=8 }) {
    this.可视区域 = { 宽度:0, 高度:0, 变化:false, 灵敏:100, 快照:NaN, 列数:1, 列宽:320, 元素:element, 边距: margin, 间距: spacing }
    this.热区元素 = []
    this.各列高度 = []
    this.更新视口状态()
  }
  // 窗口状态
  更新视口状态() {
    if (window.devicePixelRatio === 1 && this.可视区域.元素.clientWidth > 1280) {
      this.可视区域.列宽 = 480
      this.可视区域.间距 = 16
    } else {
      this.可视区域.列宽 = 320
      this.可视区域.间距 = 8
    }
    if (this.各列高度.length) {
      this.各列高度.length = 0
    }
    this.可视区域.宽度 = this.可视区域.元素.clientWidth
    this.可视区域.高度 = this.可视区域.元素.clientHeight
    this.可视区域.列数 = parseInt(this.可视区域.宽度 / (this.可视区域.列宽 + this.可视区域.间距)) || 1
    this.可视区域.边距 = (this.可视区域.宽度 - (this.可视区域.列数 * this.可视区域.列宽) - ((this.可视区域.列数 - 1) * this.可视区域.间距)) / 2
    // 热区重排(热区尚未优化, 先直接重排全部)
    this.热区元素.forEach(({元素, 信息}) => {
      this.设置元素位置(元素, 信息)
    })
  }
  设置元素位置(元素, 信息) {
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

  创建元素(删除回调, 修改回调) {}

  // 数据状态
  热区添加元素(信息, onclick) {
    let element = document.createElement('div')
    element.style.color           = 'rgba(24,24,24,.25)'
    element.style.fontWeight      = 'bold' 
    element.style.backgroundColor = 'rgba(24,24,24,.05)'
    element.style.position        = 'absolute'
    element.style.borderRadius    = '.25rem'
    element.style.overflow        = 'hidden'
    element.style.border          = 'solid 1px rgba(24,24,24,.25)'
    element.style.transition      = 'all .75s'
    element.onclick = onclick
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
    //设置元素位置(元素, 信息)
    //可视区域.元素.appendChild(元素)
    //热区元素.push({元素, 信息})
  }

  // 工具函数
  取当前最小列() {
    if (this.各列高度.length === 0) {
      for (let i=0; i<this.可视区域.列数; i++) {
        this.各列高度.push(120)
      }
    }
    let min = Math.min(...this.各列高度)
    let 列号 = this.各列高度.indexOf(min)
    return {列号, 高度:min}
  }
}
