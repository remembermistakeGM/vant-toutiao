<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        slot="title"
        class="search-btn"
        icon="search"
        type="info"
        round
        size="small"
        to='/search'
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 滑动导航栏 -->
    <van-tabs v-model="active" color="#5babfb">
      <van-tab
        v-for="(item, index) in tabsList"
        :key="index"
        :title="item.name"
        class="channel-tabs"
      >
        <!-- 内容 {{ index }} -->
        <!-- {{item.name}} -->
        <article-lists :channel="item" />
      </van-tab>

      <div class="tab-icon"  @click="showPop"><van-icon name="wap-nav" /></div>
    </van-tabs>

    <!-- 滑动导航栏 -->

    <!--弹出编辑频道层--> 
    <channel-edit 
     ref='child1'
     :userchannel='tabsList'
     @update-active="onUpdataActive"
     :active='active'
     />
    <!--弹出编辑频道层-->

  </div>
</template>

<script>
import { Button } from "vant";
import { NavBar } from "vant";
import { Toast } from "vant";
import { Tab, Tabs } from "vant";
import { Icon } from "vant";

import { getUserChannels } from "@/api/user";
import ArticleLists from "./childcomp/ArticleLists.vue";
import ChannelEdit from './childcomp/ChannelEdit.vue'
import {mapState} from 'vuex'
import {getItem} from '@/utils/storage'



export default {
  name: "HomeIndex",
  components: {
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Toast.name]: Toast,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    ArticleLists,
    ChannelEdit
  },
  props: {},
  data() {
    return {
      active: 0, //控制激活的标签
      tabsList: [],
    };
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.getChannes();
  },
  mounted() {},
  methods: {
    async getChannes() {
      let tabsList=[]
      //已登陆，请求线上数据
      if(this.user){
      const { data } = await getUserChannels();
      tabsList = data.data.channels;

      }else{
        //没有登录判断是否有本地存储的频道列表
        const localChannels =getItem ('user-channels')
        //如果有本地的存储列表，则使用
        
        if(localChannels){
          tabsList = localChannels
        }else{
          //没有登录，也没有本地存储的列表,使用默认推荐请求的数据
          //这个请求没有token
         const { data } = await getUserChannels(); 
         tabsList = data.data.channels;
        }
      }
      //把处理好的数据赋值给data的tabsList
    this.tabsList=tabsList
    },
    showPop(){
      // console.log(this.$refs.child1.isChannelEditShow);
     this.$refs.child1.isChannelEditShow=true
    },
    onUpdataActive(index){
      //接受子组件传过来的激活频道的id
      //并完成却换频道
      this.active=index
    }
  },

};
</script>

<style scoped lang="less">
.home-container {
  /deep/ .van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .van-tab--active {
    color: #5babfb !important;
  }
  .tab-icon {
    position: absolute;
    right: 0px;
    top: 5px;
    background-color: #fff;
    font-size: 0.8rem;
  }
  .channel-tabs {
    padding-left: 5px;
  }

  /deep/ .van-tab span {
    font-weight: bold;
  }
  /deep/ .van-tabs__nav--complete {
    margin-right: 26px;
  }
  /deep/ .van-tabs__wrap--scrollable .van-tab {
    padding: 0px 17px;
  }
  /deep/ .van-tabs__line {
    border-radius: 0.08rem;
    bottom: 0.5rem;
    height: 4px;
  }
  .van-tabs {
    background: #fff;
  }
}
</style>