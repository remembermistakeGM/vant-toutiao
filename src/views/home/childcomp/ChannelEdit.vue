<template>
  <div class="channel-edit">
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      class="channel-edit-popup"
      closeable
      close-icon-position="top-right"
      get-container="body"
      style="height: 100%"
    >
      <div class="pop-container">
        <van-cell :border="false">
          <div slot="title" class="title-text">我的频道</div>
          <van-button round type="warning" plain size="small" @click="edit">{{
            isEdit ? "完 成" : "编 辑"
          }}</van-button>
        </van-cell>

        <van-grid :gutter="10">
          <van-grid-item
            class="grid-item"
            v-for="(channel, index) in userchannel"
            :key="index"
            :text="channel.name"
            :icon="isEdit && index !== 0 ? 'clear' : ''"
            @click="onUserChannel(channel,index)"
            :class="{activeuser : index===active}"
            
          />
        </van-grid>

        <van-cell :border="false">
          <div slot="title" class="title-text">频道推荐</div>
        </van-cell>

        <van-grid :gutter="10">
          <van-grid-item
            class="grid-item"
            :text="recommendchannel.name"
            v-for="(recommendchannel, index) in recommendChannels"
            :key="index"
            @click="addChannel(recommendchannel)"
          />
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Cell, CellGroup, Button, Grid, GridItem } from "vant";

import { getAllChannel} from "@/api/article";
import {  addUserChannels,deleteUserChannels} from "@/api/user";

import {mapState} from 'vuex'
import {setItem} from '@/utils/storage'

export default {
  name: "ChannelEdit",
  components: {
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
  },
  data() {
    return {
      isChannelEditShow: false, //编辑面板状态
      allChannelsArr: [], //全部频道列表
      isEdit: false, //是否显示编辑图标
    };
  },
  props: {
    userchannel: {
      type: Array,
      required: true,
    },
    active:{
      type:Number,
      required:true
    }
  },
  created() {
    this.allChannels();
  },
  methods: {
    //获取全部频道
    async allChannels() {
      const { data } = await getAllChannel();
      this.allChannelsArr = data.data.channels;
    },
    //点击添加推荐频道添加到个人频道
     async addChannel(recommendchannel) {
      this.userchannel.push(recommendchannel);
      //数据持久化
    if(this.user){
        //登录了，持久化到线上
       await addUserChannels({
          channels:[
            {
            id:recommendchannel.id,
            seq:this.userchannel.length
            
            }
          ]
        })
        // console.log(datas);/
    }else{
      //没有登录，保存到本地
      setItem('user-channels',this.userchannel )
    }

    },
    //显示编辑
    edit() {
      this.isEdit = !this.isEdit;
    },
    //点击用户频道
    onUserChannel(channel,index) {
      //是否为编辑状态，是的话就删除，不是就跳转到相应频道列表
      //‘推荐’频道不能删除
      if (this.isEdit && index !== 0) {
        //删除频道
        this.deleteChannel(channel,index);
      
      } else {
        //却换频道
        this.switchChannel(index);
      }
    },
    //删除频道
   async deleteChannel(channel,index){
       console.log(index);
      //如果删除的是当前激活频道之前的频道
          if(index <= this.active){
            //更新激活频道的索引
          this.$emit('update-active',this.active - 1)
        }
        this.userchannel.splice(index,1)

        //数据持久化
   
        //登录了，持久化到线上
        if(this.user){
        const data=  await deleteUserChannels(channel.id)
        }else{
          //没有登录，保存到本地
           setItem('user-channels',this.userchannel )
        }
    },
    //却换频道
    switchChannel(index){
        this.isChannelEditShow=false
        //把点击的频道id传给父组件
        this.$emit('update-active',index)

    }
  },
  computed: {
    //把store的user映射到本地
    ...mapState(['user']),


    //用计算属性计算 全部频道-我的频道= 推荐频道
    recommendChannels() {
      //先用filter筛选器筛选全部频道 返回符合条件的数据
      //再用find寻找符合个人频道
      //最后返回不相等的频道id，得到的就是推荐频道
      return this.allChannelsArr.filter((channel) => {
        return !this.userchannel.find((userchan) => {
          return userchan.id === channel.id;
        });
      });
    },
  },
};
</script>

<style scoped lang='less'>
/deep/ .van-popup__close-icon {
  // padding-top: 54px;
}
.pop-container {
  margin-top: 50px;
  .title-text {
    font-weight: bold;
    font-size: 0.5rem;
    margin-top: 10px;
  }
  .grid-item {
    width: 80px;
    height: 40px;
    margin-top: 10px;
    /deep/ .van-grid-item__content {
      background-color: #f4f5f6;
      padding: 2px;
    }
    /deep/ .van-grid-item__text {
      font-size: 14px;
      color: #222;
      font-weight: bold;
      margin-top: 0px;
    }
  }
  /deep/ .van-grid-item__icon {
    position: absolute;
    right: -8px;
    top: -13px;
    font-size: 0.5rem;
    color: rgb(162, 162, 162);
  }
  .activeuser{

   /deep/ .van-grid-item__text{
      color: #ec4c4c;
      }
  }
}
</style>