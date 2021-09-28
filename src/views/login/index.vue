<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="注册 / 登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form
      ref="login-form"
      @submit="onLogin"
      :show-error="false"
      :show-error-message="false"
      @failed="onFailed"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        placeholder="请输入手机号"
        name="mobile"
        :rules="formRules.mobile"

      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        placeholder="请输入验证码"
        name="code"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down :time='1000 * 6'
          format='ss 秒'
          v-if="isShowCountDown"
          @finish='isShowCountDown=false'
          
          />
          <van-button class="send-btn" 
          size="mini" round 
          @click.prevent="onSendSms"
          v-else
          :loading='isShowSendSmsLoading'
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block 
          >登录</van-button
        >
      </div>
      <!-- /登录表单 -->
    </van-form>
  </div>
</template>



<script>
import { Button } from "vant";
import { field } from "vant";
import { Cell, CellGroup } from "vant";
import { NavBar } from "vant";
import { Toast } from "vant";
import { Form } from "vant";
import { CountDown } from 'vant';

import { login,sendSms } from "@/api/user";


export default {
  name: "LoginIndex",
  components: {
    [Button.name]: Button,
    [field.name]: field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [NavBar.name]: NavBar,
    [Toast.name]: Toast,
    [Form.name]: Form,
    [CountDown.name]:CountDown
  },
  props: {},
  data() {
    return {
      user: {
        mobile: "17090086870", // 手机号
        code: "246810", // 验证码
      },
      formRules: {
        mobile: [
          { required: true, message: "请输入手机号" },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: "手机号格式错误" },
        ],
        code: [
          { required: true, message: "请输入验证码" },
          { pattern: /^\d{6}$/, message: "验证码错误" },
        ],
      },
      isShowCountDown:false,//是否显示倒计时
      isShowSendSmsLoading:false//是否显示发送按钮加载状态
     
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLogin() {
      // 开始转圈圈
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: "登录中...", // 提示消息
      });

      try {
        const res = await login(this.user);
        // console.log("登录成功", res);
        // 提示 success 或者 fail 的时候，会先把其它的 toast 先清除
        this.$toast.success("登录成功");
        //存储token到state中管理
        this.$store.commit('savaToken',res.data.data)

      //登录成功后，删除缓存页面
      this.$store.commit('deleteCachePages','Layout')

        // this.$router.push('/my')
        //如果有跳转回去的页面就会回去，没有的化就去首页
        this.$router.push(this.$route.query.redirect || '/')

      } catch (err) {
        if (err.response.status === 400) {
          // console.log("登录失败", err);
          this.$toast.fail("登录失败，手机号或验证码错误");
        }
      }
      // console.log(this.$store.state.user); 
      // console.log(this.$store);
    },

    async onSendSms() {
      this.isShowSendSmsLoading=true
      try {
        // 校验手机号码
        await this.$refs["login-form"].validate("mobile");
        

        const res = await sendSms(this.user.mobile)
        this.isShowCountDown=true
        // 验证通过 -> 请求发送验证码 -> 用户接收短信 -> 输入验证码 -> 请求登录
        // 请求发送验证码 -> 隐藏发送按钮，显示倒计时
        // 倒计时结束 -> 隐藏倒计时，显示发送按钮
      } catch (err) {
        let message='';
        //发送短信失败的错误信息
        if(err && err.response && err.response.status===429){
          message='发送太频繁了'
        }
        else if(err.name==='mobile'){
          //表单验证失败的错误信息
          message=err.message
        }
        else{
          //未知错误
          message='发送失败，请稍后重试'
        }
        this.$toast({
          message: err.message,
          position: "top",
        });
      }
      this.isShowSendSmsLoading=false
      
    },
    onFailed (error) {
  if (error.errors[0]) {
    this.$toast({
      message: error.errors[0].message, // 提示消息
      position: 'top' // 防止手机键盘太高看不见提示消息
    })
  }
}
  },
};
</script>

<style scoped lang="less">
.login-container {
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>