<template>
  <div class="edit-image-contanner">
    <!-- 编辑头像 -->
    <div style="width=100%">
      <img class="img" :src="image" alt="" ref="img" />
    </div>

    <van-nav-bar
      left-text="取消"
      right-text="确定"
      class="img-navbar"
      @click-left="$emit('close')"
      @click-right="confirm"
    >
    </van-nav-bar>
  </div>
</template>

<script>
import { NavBar, Toast } from "vant";
import { getUserPhoto } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
  name: "EditImage",
  components: {
    [NavBar.name]: NavBar,
    [Toast.name]: Toast,
  },
  props: {
    file: {
      type: [String, Object, File],
      required: true,
    },
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null, //裁剪器实例
    };
  },

  methods: {
    getCroppedCanvas() {
      //封装Promise,这是裁剪过的图片对象
      return new Promise((resolve) => {
        this.cropper.getCroppedCanvas().toBlob((blob) => {
          resolve(blob);
        });
      });
    },
    async confirm() {
      //上传用户头像
      this.$toast.loading({
        message: "保存中",
        forbidclick: true,
      });
      // multipart/form-data，
      //如果Headers要求传multipart/form-data，参数，则一定要提交FormData数据对象
      //专门用于文件上传 ，不能提交{}。
      //方法一：传裁剪过的对象file
      const file = await this.getCroppedCanvas();
      const fd = new FormData();
      // fd.append('photo',文件对象)
      fd.append("photo", file);

      //方法二：传裁未剪过的对象this.file
      // const fd  = new FormData()
      // fd.append('photo',文件对象)
      // fd.append('photo',this.file)

      const data = await getUserPhoto(fd);
    //   console.log(data);
      this.$toast.success("修改成功");
      this.$emit("editedImg", window.URL.createObjectURL(file));
    },
  },
  mounted() {
      //图片裁剪框参数
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
};
</script>

<style lang="less" scoped>
.img-navbar {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
}
.img {
  display: block;
  max-width: 100%;
}
</style>