/**
 * @fileoverview html 解析器
 */

// 配置
const config = {
  // 信任的标签（保持标签名不变）
  trustTags: makeMap('a,abbr,ad,audio,b,blockquote,br,code,col,colgroup,dd,del,dl,dt,div,em,fieldset,h1,h2,h3,h4,h5,h6,hr,i,img,ins,label,legend,li,ol,p,q,ruby,rt,source,span,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,title,ul,video'),

  // 块级标签（转为 div，其他的非信任标签转为 span）
  blockTags: makeMap('address,article,aside,body,caption,center,cite,footer,header,html,nav,pre,section'),

  // #ifdef (MP-WEIXIN || MP-QQ || APP-PLUS || MP-360) && VUE3
  // 行内标签
  inlineTags: makeMap('abbr,b,big,code,del,em,i,ins,label,q,small,span,strong,sub,sup'),
  // #endif

  // 要移除的标签
  ignoreTags: makeMap('area,base,canvas,embed,frame,head,iframe,input,link,map,meta,param,rp,script,source,style,textarea,title,track,wbr'),

  // 自闭合的标签
  voidTags: makeMap('area,base,br,col,circle,ellipse,embed,frame,hr,img,input,line,link,meta,param,path,polygon,rect,source,track,use,wbr'),

  // html 实体
  entities: {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    ensp: '\u2002',
    emsp: '\u2003',
    nbsp: '\xA0',
    semi: ';',
    ndash: '–',
    mdash: '—',
    middot: '·',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
    bull: '•',
    hellip: '…',
    larr: '←',
    uarr: '↑',
    rarr: '→',
    darr: '↓'
  },

  // 默认的标签样式
  tagStyle: {
    // #ifndef APP-PLUS-NVUE
    address: 'font-style:italic',
    big: 'display:inline;font-size:1.2em',
    caption: 'display:table-caption;text-align:center',
    center: 'text-align:center',
    cite: 'font-style:italic',
    dd: 'margin-left:40px',
    mark: 'background-color:yellow',
    pre: 'font-family:monospace;white-space:pre',
    s: 'text-decoration:line-through',
    small: 'display:inline;font-size:0.8em',
    strike: 'text-decoration:line-through',
    u: 'text-decoration:underline'
    // #endif
  },

  // svg 大小写对照表
  svgDict: {
    animatetransform: 'animateTransform',
    lineargradient: 'linearGradient',
    viewbox: 'viewBox',
    attributename: 'attributeName',
    repeatcount: 'repeatCount',
    repeatdur: 'repeatDur'
  }
}
const tagSelector={}
const {
  windowWidth,
  // #ifdef MP-WEIXIN
  system
  // #endif
} = uni.getSystemInfoSync()
const blankChar = makeMap(' ,\r,\n,\t,\f')
let idIndex = 0

// #ifdef H5 || APP-PLUS
config.ignoreTags.iframe = undefined
config.trustTags.iframe = true
config.ignoreTags.embed = undefined
config.trustTags.embed = true
// #endif
// #ifdef APP-PLUS-NVUE
config.ignoreTags.source = undefined
config.ignoreTags.style = undefined
// #endif

/**
 * @description 创建 map
 * @param {String} str 逗号分隔
 */
function makeMap (str) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = list.length; i--;) {
    map[list[i]] = true
  }
  return map
}

/**
 * @description 解码 html 实体
 * @param {String} str 要解码的字符串
 * @param {Boolean} amp 要不要解码 &amp;
 * @returns {String} 解码后的字符串
 */
function decodeEntity (str, amp) {
  let i = str.indexOf('&')
  while (i !== -1) {
    const j = str.indexOf(';', i + 3)
    let code
    if (j === -1) break
    if (str[i + 1] === '#') {
      // &#123; 形式的实体
      code = parseInt((str[i + 2] === 'x' ? '0' : '') + str.substring(i + 2, j))
      if (!isNaN(code)) {
        str = str.substr(0, i) + String.fromCharCode(code) + str.substr(j + 1)
      }
    } else {
      // &nbsp; 形式的实体
      code = str.substring(i + 1, j)
      if (config.entities[code] || (code === 'amp' && amp)) {
        str = str.substr(0, i) + (config.entities[code] || '&') + str.substr(j + 1)
      }
    }
    i = str.indexOf('&', i + 1)
  }
  return str
}

/**
 * @description 合并多个块级标签，加快长内容渲染
 * @param {Array} nodes 要合并的标签数组
 */
function mergeNodes (nodes) {
  let i = nodes.length - 1
  for (let j = i; j >= -1; j--) {
    if (j === -1 || nodes[j].c || !nodes[j].name || (nodes[j].name !== 'div' && nodes[j].name !== 'p' && nodes[j].name[0] !== 'h') || (nodes[j].attrs.style || '').includes('inline')) {
      if (i - j >= 5) {
        nodes.splice(j + 1, i - j, {
          name: 'div',
          attrs: {},
          children: nodes.slice(j + 1, i + 1)
        })
      }
      i = j - 1
    }
  }
}

/**
 * @description html 解析器
 * @param {Object} vm 组件实例
 */
function Parser (vm) {
  this.options = vm || {}
  this.tagStyle = Object.assign({}, config.tagStyle, this.options.tagStyle)
  this.imgList = vm.imgList || []
  this.imgList._unloadimgs = 0
  this.plugins = vm.plugins || []
  this.attrs = Object.create(null)
  this.stack = []
  this.nodes = []
  this.pre = (this.options.containerStyle || '').includes('white-space') && this.options.containerStyle.includes('pre') ? 2 : 0
}

/**
 * @description 执行解析
 * @param {String} content 要解析的文本
 */
Parser.prototype.parse = function (content) {
  // 插件处理
  for (let i = this.plugins.length; i--;) {
    if (this.plugins[i].onUpdate) {
      content = this.plugins[i].onUpdate(content, config) || content
    }
  }

  new Lexer(this).parse(content)
  // 出栈未闭合的标签
  while (this.stack.length) {
    this.popNode()
  }
  if (this.nodes.length > 50) {
    mergeNodes(this.nodes)
  }
  return this.nodes
}

/**
 * @description 将标签暴露出来（不被 rich-text 包含）
 */
Parser.prototype.expose = function () {
  // #ifndef APP-PLUS-NVUE
  for (let i = this.stack.length; i--;) {
    const item = this.stack[i]
    if (item.c || item.name === 'a' || item.name === 'video' || item.name === 'audio') return
    item.c = 1
  }
  // #endif
}

/**
 * @description 处理插件
 * @param {Object} node 要处理的标签
 * @returns {Boolean} 是否要移除此标签
 */
Parser.prototype.hook = function (node) {
  for (let i = this.plugins.length; i--;) {
    if (this.plugins[i].onParse && this.plugins[i].onParse(node, this) === false) {
      return false
    }
  }
  return true
}

/**
 * @description 将链接拼接上主域名
 * @param {String} url 需要拼接的链接
 * @returns {String} 拼接后的链接
 */
Parser.prototype.getUrl = function (url) {
  const domain = this.options.domain
  if (url[0] === '/') {
    if (url[1] === '/') {
      // // 开头的补充协议名
      url = (domain ? domain.split('://')[0] : 'http') + ':' + url
    } else if (domain) {
      // 否则补充整个域名
      url = domain + url
    } /* #ifdef APP-PLUS */ else {
      url = plus.io.convertLocalFileSystemURL(url)
    } /* #endif */
  } else if (!url.includes('data:') && !url.includes('://')) {
    if (domain) {
      url = domain + '/' + url
    } /* #ifdef APP-PLUS */ else {
      url = plus.io.convertLocalFileSystemURL(url)
    } /* #endif */
  }
  return url
}

export default Parser
