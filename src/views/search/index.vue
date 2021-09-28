<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- 包一个form的作用是在手机端输入法显示搜索按钮 -->
    <van-form action='/'>
   <van-cell>
      <van-search
      v-model="searchText"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="$router.back()"
      @focus="isResultShow = false"
      style="width:85%"
    />
    <van-button size='small' type="primary"
    @click="$router.back()"
    > 取消</van-button>
    
   </van-cell>
    </van-form>
  <!-- 文章列表-搜索结果 -->
    <search-article 
    v-if="isResultShow"
    @inputNull="inputNull"
     :q='searchText'
      
     >

    </search-article>
    <!-- 文章列表 --> 


    <!-- 联想建议 -->
    <!-- //@search="onSearch"时间子组件传过来的item给searchText -->
        <suggestion 
        v-else-if="searchText"
        :search-text='searchText'
        @search="onSearch"
          >
         
       </suggestion>
    <!-- 联想建议 -->
  

  <!-- 搜索历史 -->
     <history
      v-else
      @historyTo='onSearch'
      >

     </history>
    <!-- 搜索历史 -->


  

  </div>
</template>

<script>
import { Search,Cell,Form,Toast,Button,CellGroup} from "vant";
import suggestion from './childcomp/suggestion.vue'
import SearchArticle from './childcomp/SearchArticle';
import History from './childcomp/History.vue';
import {setItem,getItem} from '@/utils/storage'



export default {
  name: "Search",
  components: {
    [Search.name]: Search,
    [Form.name]: Form,
    [Cell.name]: Cell,
    [Toast.name]: Toast,
    [Button.name]:Button,
    [CellGroup.name]:CellGroup,
    suggestion,
    SearchArticle,
    History,
   
 
  },
  data() {
    return {
      searchText: "",
      isResultShow:false, //是否有搜索结果
      searchHistory:getItem('search-history') || [] //历史记录
    };
  },
  methods: {
    onSearch(searchText) {
      // 按回车或者点击推荐触发
      if(searchText !== ''){
       this.searchText = searchText
      this.isResultShow=true

      //搜索后加入历史记录
        //  监听数组状态
        //如果没有返回-1，有的话返回下标
          const arrayStatus= this.searchHistory.indexOf(searchText)

         if(arrayStatus !==-1){
          //  删除原有位置
        this.searchHistory.splice(arrayStatus,1)
        //将新搜索加到前面
        this.searchHistory.unshift(searchText)
      }else{
        this.searchHistory.unshift(searchText)
       }
        //数据持久化，
      setItem('search-history',this.searchHistory)
      // console.log(this.searchHistory);
      }else{
        Toast('请输入内容')
      }
    }
  


    
  },
};
</script>

<style lang="less" scoped>

  /deep/.van-cell__value--alone{
    display: flex;
    align-items: center;
  }

</style>