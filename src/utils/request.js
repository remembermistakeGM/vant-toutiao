import axios from 'axios';
import store from '@/store/'
import JSONbig from 'json-bigint'
import {Toast} from 'vant'
import router from "@/router/";

const request =axios.create({
    baseURL:'http://ttapi.research.itcast.cn/',

    transformResponse : [function (data) {
      // console.log(data)//这里的data是字符串，在这个字符串的是没有丢失精度的，所以需要在这里先把精度调好
        try {
        //作用1：把json字符串转为js对象
        //作用2：把里面的大数字做安全处理
         return JSONbig.parse(data)
        }catch(err){
          // console.log("转化失败"+err)
        return data;
        }
      }]
        //return data;

})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const {user} =store.state
    //如果用户已登陆，统一设置token
    if(user){
        config.headers.Authorization = `Bearer ${user.token}`
    }

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么

    return response;
  },async function (error) {
    // 对响应错误做点什么

    // 任何超出2xx范围的状态码都会触发此函数，这里主要用于处理响应错误
    // console.log(error.response);

    const status  = error.response.status
      // const status = 401

          const {user} = store.state

    if (status === 401) { // 未授权 ,token无效
      //token失效后，使用refresh_token发送请求刷新token
      if (!user || !user.token) {
        // router.push('/login')
        // 代码不要往后执行了
        return redirectLogin()
      }
      // 如请求获取新的 token
      try {
      const res = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 如果获取成功，则把新的 token 更新到容器中
      // console.log('刷新token成功', res)
      store.commit('savaToken', {
        token: res.data.data.token, // 最新获取的可用 token
        refresh_token: user.refresh_token // 还是原来的 refresh_token
      })


      //把之前失败的用户请求继续发出去
      // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
      // return 把 request 的请求结果继续返回给发请求的具体位置
      return request(error.config)


    }
      catch (error) {
        

        // 如果获取失败，直接跳转 登录页
        // console.log('请求刷线 token 失败', error)
        // router.push('/login')
       redirectLogin()

      }


    } else if (status === 403) { // 没有权限

    } else if (status === 404) { // 资源不存在
      Toast.fail({
        message: '请求资源不存在',
        forbidClick: true
      })
    } else if (status >= 500) { // 服务端异常
      Toast.fail({
        message: '服务端异常，请稍后重试',
        forbidClick: true
      })

    }

    return Promise.reject(error);
  });

  function redirectLogin () {
    router.replace({
      name:'login',
      // 查询参数会以？ 作为分隔符放到url后面
      // router.currentRoute 当前路由对象，和你在组件中访问的 this.$route 是同一个东西
       // query 参数的数据格式就是：?key=value&key=value
      query:{
        redirect:router.currentRoute.fullPath

      }
    })
     }
export default request
