import Vue from 'vue'
import Vuex from 'vuex'
import {getItem,setItem,removeItem} from '@/utils/storage.js'
Vue.use(Vuex)

const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    //当前用户登录状态（token等）
    // user:JSON.parse(window.localStorage.getItem('user')),//将json转化为js对象使用
    user:getItem(USER_KEY),
    
  //缓存页面
    cachePages:['Layout']
    },
  getters:{

  },
  mutations: {
    savaToken(state,data){
        state.user=data

        //防止页面刷新数据丢失，把数据保存到本地存储里，
        //localStorage存储数据是json对象
        //JSON.stringify()将对象转化为json格式，
        
        // let tokenData=JSON.stringify(state.user)
        // window.localStorage.setItem('user',tokenData)
        
        setItem(USER_KEY,state.user)
        // console.log(getItem(USER_KEY));
    },
    loginOut(state){//退出登录
      removeItem(USER_KEY);//删除token,
      this.state.user=getItem(USER_KEY)//将token重新给user，此时为null
    },

    //添加页面缓存
    addCachePages(state,pageName){
      //如果没有就push就去
      if(!state.cachePages.includes(pageName)){
        state.cachePages.push(pageName)
      }
    },

     //删除页面缓存
     deleteCachePages(state,pageName){
       //如果有才删除
       const index = state.cachePages.indexOf(pageName)
        if(index !== -1){
          state.cachePages.splice(index,1)
        } 
     },

  },
  actions: {
  },
  modules: {
  }
})
