<template>
<div class="layout-ccontainer">
    <!-- 路由出口 -->
    <!-- 路由缓存 -->
     <keep-alive>
    <router-view />
    </keep-alive>

<!-- 底部导航 -->
  <van-tabbar v-model="mainActive" route>
  <van-tabbar-item icon="home-o"  to="/">首页</van-tabbar-item>
  <van-tabbar-item icon="search" >问答</van-tabbar-item>
  <van-tabbar-item icon="friends-o" >视频</van-tabbar-item>
  <van-tabbar-item icon="setting-o"  to="/my">我的</van-tabbar-item>
</van-tabbar>
<!-- 底部导航 -->

</div>
</template>

<script>
import {TabbarItem ,Tabbar} from 'vant'
export default {
    name:"Layout",
    components:{
        [TabbarItem.name]:TabbarItem,
        [Tabbar.name]:Tabbar
    },

     data() {
    return {
      mainActive: 0,
    };
  },
  methods:{
      
  },
  mounted(){
    //页面渲染后添加缓存页面
    this.$store.commit('addCachePages','Layout')
  }
}
</script>

<style>

</style>