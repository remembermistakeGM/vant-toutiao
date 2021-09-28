<template>
  <div id="app">
    <!-- <keep-alive>对一级路由出口有效 -->
      <!-- 首页等不在一级路由，所以要单独加-->
      <!-- include表示被缓存，里面的值就是组件里面的name -->
    <keep-alive :include="cachePages">
    <router-view />
    </keep-alive>

  </div>
</template>
<script>
import  { mapState } from 'vuex'


export default {
  name:'App',
  components: {
  },
  computed:{
    ...mapState(['cachePages'])
  }
}
</script>

<style>
#app {

}


</style>
