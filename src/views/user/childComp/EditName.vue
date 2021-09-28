<template>
  <div class="edit-name-container">
    <!-- 编辑昵称 -->
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="编辑昵称"
      left-arrow
      @click-left="$emit('editedName')"
      right-text="完成"
      @click-right="onClickRight"
    />

    <!-- /导航栏 -->

    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      placeholder="请输入新昵称"
      show-word-limit
      maxlength="10"
      label="昵称"
      border
      class="editbg"
    />
  </div>
</template>

<script>
import { NavBar, Field, Toast } from "vant";
import { editUserProfile } from "@/api/user";
export default {
  name: "EditName",
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Toast.name]: Toast,
  },
  data() {
    return {
      message: this.name,
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onClickRight() {
        if(this.message === ''){
        this.$toast.fail("不能为空");
        return

        }
      Toast.loading({
        duration: 1000, // 持续展示 toast
        message: "加载中...",
        forbidClick: true,
      });
      try {
        const data = await editUserProfile({
          name: this.message, //昵称
        });
        // console.log(data);
        this.$toast.success('修改成功')
        this.$emit('editedName',this.message)
      } catch (error) {
        this.$toast.fail("修改失败");
      }
    },
  },
};
</script>

<style scoped lang='less'>
.editbg {
  background-color: rgb(217, 217, 217);
  color: #000;
  font-weight: bold;
}
</style>
