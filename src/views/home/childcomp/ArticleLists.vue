<template>
  <div class="article-list-container"  ref="articleList">
    <!-- 下拉刷新 -->
    <van-pull-refresh 
    v-model="isPullDownLoading"
     @refresh="onRefresh"
     :success-text='refreshSuccessText'
     >
    

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
       
      >
        <article-item
          v-for="(article, index) in articles"
          :key="index"
          :article='article'
        />
  
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>

import { List } from "vant";
import { PullRefresh } from "vant";
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/articleitem";
import { debounce } from "lodash";

export default {
  name: "ArticleLists",
  components: {

    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
   
    ArticleItem,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      finished: false,
      articles: [],
      timestamp: null, //获取下一次请求的时间戳
      isPullDownLoading: "", //下拉刷新状态
      refreshSuccessText:'', //下拉刷新提示
      scrollTop:0,//列表滚动到顶部的距离
    };
  },
  computed: {},
  watch: {},
  created() {},
  activated(){
    // console.log('从缓存中被激活');
    //把记录的滚动位置重新设置回去
    this.$refs.articleList.scrollTop = this.scrollTop
  },
  deactivated(){
    // console.log('组件失去活动了');

  },
  mounted() {
    const articleList = this.$refs.articleList
    articleList.onscroll = debounce(() =>{
      // console.log(articleList.scrollTop);
      this.scrollTop = articleList.scrollTop
      // console.log(this.scrollTop);
    },50)
  },
  methods: {
    async onLoad() {
      // 异步更新数据

      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，
        //请求历史推荐传指定的时间戳，timestamp 相当于页码，请求最新数据使用当前最新时间戳，
        //下一页数据使用上一次返回的数据中的时间戳
        with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      });

      // console.log(data);
      const { results } = data.data;
      //2.将数据放到列表中
      this.articles.push(...results);
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // for (let i = 0; i < 10; i++) {
      //   this.list.push(this.list.length + 1);
      // }

      // 3.加载状态结束 判断是否需要下一次刷新
      this.loading = false;

      // 数据全部加载完成
      // 4. 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp;
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true;
      }
    },
    //下拉刷新
    async onRefresh() {
      // setTimeout(() => {
      // Toast("刷新成功");
      //1，请求数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道 ID
        timestamp: Date.now(), // 为了大家方便学习，只要你传递不同的时间戳就一定给你返回不一样的数据，而且数据不为空
        with_top: 1,
      });

      // 2. 把数据放到数据列表中（往顶部追加）
      const { results } = data.data;
      this.articles.unshift(...results);

      // 3. 关闭刷新的状态 loading
      this.isPullDownLoading = false;

      this.refreshSuccessText = `更新了${results.length}条数据`;
    },
  },
};
</script>

<style scoped lang="less">
//记住列表的滚动位置（每个列表自己的滚动容器，每个容器有不同的滚动位置）
.article-list-container {
  position: fixed;
  top: 90px;
  bottom: 50px;
  left: 0px;
  right: 0px;
  overflow-y: auto;
}
</style>