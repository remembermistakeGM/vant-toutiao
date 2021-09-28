<template>
  <div class="my-container">
    <van-cell-group class="my-info" v-if='user'>
      <van-cell
        class="base-info"
        title="单元格"
        value="内容"
        center
        :border="false"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="userInfo.photo"
        />

        <div class="name" slot="title" >{{userInfo.name}}</div>
        <van-button
          class="update-btn"
          size="small"
          round
          to='/user'
          
        >编辑资料</van-button>
      </van-cell>
      <van-grid class="data-info" :border="false">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{userInfo.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{userInfo.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-wrap">
            <div class="count">{{userInfo.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div class="text-wrap" slot="text">
            <div class="count">{{userInfo.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div class="not-login" v-else>
      <div @click="$router.push('/login')">
        <img class="mobile" src="./mobile.png">
      </div>
      <div class="text" @click="login">登录 / 注册</div>
    </div>

    <van-grid class="nav-grid mb-4" :column-num="2">
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="shoucang"
        text="收藏"
      />
      <van-grid-item
        class="nav-grid-item"
        icon-prefix="toutiao"
        icon="lishi"
        text="历史"
      />
    </van-grid>

    <van-cell title="消息通知" is-link to="/" />
    <van-cell class="mb-4" title="小智同学" is-link to="/UserChat" />
    <van-cell 
      v-if='user'
      class="logout-cell"
      @click="loginOut"
      title="退出登录"
    />
  </div>
</template>

<script>
import { Button } from "vant";
import { field } from "vant";
import { Cell, CellGroup } from "vant";
import { NavBar } from "vant";
import { Toast } from "vant";
import { Form } from "vant";
import { Image } from "vant";
import { Grid } from "vant";
import { GridItem } from "vant";
import { Dialog } from 'vant';

import {mapState} from 'vuex'
import {getUserInfo} from '@/api/user'

export default {
  name: 'MyIndex',
  components: {
     [Button.name]: Button,
    [field.name]: field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [NavBar.name]: NavBar,
    [Toast.name]: Toast,
    [Form.name]: Form,
    [Image.name]: Image,
    [Grid.name]:Grid,
    [GridItem.name]:GridItem,
    [Dialog.name]:Dialog


  },
  props: {},
  data () {
    return {
      userInfo:{},
    }
  },
  computed: {
      ...mapState(['user']) 
  },
  watch: {},
  created () {
      // console.log(this.$store.state);
      this.loadUserInfo();
  },
  mounted () {},
  methods: {
    loginOut(){//退出登录确定框
      Dialog.confirm({
      message: '确定退出登录？',
})
  .then(() => {
    // on confirm
    this.$store.commit('loginOut')
  })
  .catch(() => {
    // on cancel
  });

    },
    login(){//登录
    this.$router.push('/login');

    },
   async loadUserInfo(){
      const {data} =await getUserInfo();
      this.userInfo=data.data
  
  }
   
  }
}
</script>

<style scoped lang="less">
.my-container {
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name { 
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }

  .not-login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

  /deep/ .nav-grid {
    .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .logout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>