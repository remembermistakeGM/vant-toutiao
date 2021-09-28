<template>
  <div class="suggestion-container">
    <!-- 联想建议 -->
     <van-cell
            icon="search"
            v-for="(item, index) in suggestions"
            :key="index"
            @click="$emit('search',item)"
          >
            <div slot="title" v-html="highlight(item, searchText)"></div>
  </van-cell>
  </div>
</template>

<script>
import { Cell, Icon } from "vant";
import { debounce } from "lodash"
import { getSuggestions } from "@/api/search"
export default {
  name: "Suggestion",
  components: {
    [Cell.name]: Cell,
    [Icon.name]: Icon,
  },
  props: {
     searchText: {
      type:String,
      required: true,
    },
  },
  data() {
    return {
      suggestions:[]
     
    };
  },
  methods: {
      highlight(source, keyword) {
      // 参数 source: 原始字符串
      // 参数 keyword: 需要高亮的关键词
      // 返回值：替换之后的高亮字符串
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      const reg = new RegExp(keyword, "gi");
      return source.replace(
        reg,
        `<span style="color: #3296fa">${keyword}</span>`
      );
    },
  ongetSuggItem(item){
   this.$emit('search',item)
  }

  },
  computed:{
  },
  watch:{
    // debounce 函数
// 参数1：函数
// 参数2：防抖时间
// 返回值：防抖之后的函数，和参数1功能是一样的
searchText:{
  handler:debounce(async function () {
  const searchText = this.searchText
  if (!searchText) {
    return
  }
  // 1. 请求获取数据
  const { data } = await getSuggestions(this.searchText)
  // 2. 将数据添加到组件实例中
  this.suggestions = data.data.options
  // 3. 模板绑定
}, 200),
  immediate:true
},
    
  }
};
</script>

<style>
</style>