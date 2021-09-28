<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <input type="file" hidden ref="file"
      accept="image/*"
      @change="inFileChange"
    >
    <van-cell
      class="avatar-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      @click="IsShowEditName = true"
      is-link
    />
    <van-cell title="性别"
     :value="user.gender ? '女' : '男'" is-link
     @click="IsShowEditSex = true"
      />
    <van-cell title="生日" :value="user.birthday" is-link
      @click="IsShowEditBirthday = true"
     />
    <!-- /个人信息 -->
    <!-- 修改名字 -->
    <van-popup
      v-model="IsShowEditName"
      position="bottom"
      :style="{
        height: '100%',
      }"
    >
      <edit-name
        :name="user.name"
        @editedName="editedName"
        v-if="IsShowEditName"
      />
    </van-popup>

    <!-- 修改性别 -->
  <van-popup
      v-model="IsShowEditSex"
      position="bottom"
    >
    <edit-sex
      @close='IsShowEditSex = false'
      @editedSex='user.gender = $event, IsShowEditSex =false'
      v-model="user.gender"
      v-if="IsShowEditSex"
     />
      
    </van-popup>
    <!-- 修改性别 -->

    <!-- 修改生日 -->
     <van-popup
      v-model="IsShowEditBirthday"
      position="bottom"
    >
    <edit-birthday
      @close='IsShowEditBirthday = false'
      v-if="IsShowEditBirthday"
      v-model="user.birthday"
      @editedBrithday='user.birthday = $event ,IsShowEditBirthday = false'
     />
      
    </van-popup>
    <!-- 修改生日 -->
   <!-- 修改用户头像 -->

     <van-popup
      v-model="IsShowEditImg"
      position="bottom"
      style="height:100%"
    >
    <edit-image
      v-if="IsShowEditImg"
      :file='previewimage'
      @close='IsShowEditImg = false'
      @editedImg ='user.photo = $event ,IsShowEditImg = false'
     />
      
    </van-popup>
    <!-- 修改用户头像 -->

  </div>
</template>

<script>
import { NavBar, Cell, Image, Uploader, Popup,Picker  } from "vant";
import { getUserProfile, getUserPhoto } from "@/api/user";
import EditName from "./childComp/EditName.vue";
import EditSex from './childComp/EditSex.vue';
import EditBirthday from './childComp/EditBirthday.vue';
import EditImage from './childComp/EditImage.vue';


export default {
  name: "User",
  components: {
    EditName,
    EditSex,
    EditBirthday,
    EditImage,
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [Image.name]: Image,
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    [Picker.name]:Picker 
  },
  props: {},
  data() {
    return {
      user: {},
      IsShowEditName: false, //编辑昵称
      IsShowEditSex:false,//性别
      IsShowEditBirthday:false,//生日
      IsShowEditImg:false, //编辑头像
      previewimage:null //预览图片
    };
  },
  computed: {},
  watch: {},
  created() {
    this.userProfile();
  },
  mounted() {},
  methods: {
    async userProfile() {
      const { data } = await getUserProfile();
      this.user = data.data;
    },
   
    editedName(name) {
      this.IsShowEditName = false;
      this.user.name = name;
      console.log(name);
    },
     inFileChange() {
      this.IsShowEditImg = true

    //预览图片
    //获取图片地址对象
   //  const  blob = window.URL.createObjectURL(this.$refs.file.files[0])
    // console.log(blob);
    const file = this.$refs.file.files[0]

      this.previewimage = file
      // 清空 为了选择相同的文件时也触发事件
      this.$refs.file.value = ''
      


    },
  },
};
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
}
</style>