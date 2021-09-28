import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'
import {Dialog } from 'vant';


Vue.use(VueRouter)

const routes = [
 
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/'),
    meta: { requiresAuth: false } //添加自定义数据，作用是是否需要访问才能登陆
  },
  {
    path: '/',
    component: () => import('../components/layout/'),
    children:[
      {
      path:"",//默认子路由,默认加载首页
      name: 'home',
      component: () => import('../views/home/'),
      meta: { requiresAuth: false }
    },
    {
      path: '/my',//我的
      name: 'my',
      component: () => import('../views/my/'),
      meta: { requiresAuth: false }
    },
    ]
    
  },
  {
    path: '/search',//搜索页面
    name: 'search',
    component: () => import('../views/search/'),
    meta: { requiresAuth: false }
  },
  {
    path:"/article/:articleId",//文章详情
    name:'article',
    component:() => import('../views/article/'),
    //将动态路由映射到props中
    props:true,
    meta: { requiresAuth: false }
  },
  {
    path:"/user",//个性资料
    name:'user',
    component:() => import('../views/user/'),
    meta: { requiresAuth: false }
  },
  {
    path:"/UserChat",//小智同学
    name:'UserChat',
    component:() => import('../views/userchat/'),
    meta: { requiresAuth: true }
  }
  

]

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  //是否需要登录，不需要就next放行
  if (to.name === 'login' || !to.meta.requiresAuth) {
    return next()
  }

  if (store.state.user) {
    return next()
  }

  Dialog.confirm({
    title: '该功能需要登录，确认登录吗？'
  }).then(() => {
    next({
      name: 'login',
      query: {
        redirect: from.fullPath
      }
    })
  }).catch(() => {
    // on cancel
  })
})


export default router
