<template>
  <div class="comment-post">
    <!-- 发布评论 -->
    <van-field
      class="post-field"
      v-model="inputComment"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onAddComment">发布</van-button>
  </div>
</template>

<script>
import { Field, Button, Toast } from "vant";
import { addComment } from "@/api/comment";

export default {
  name: "commentPost",
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      inputComment: "",
    };
  },
  methods: {
    async onAddComment() {
      const inputComment = this.inputComment.trim();

      // 非空校验
      if (!inputComment.length) {
        return;
      }

      this.$toast.loading({
        duration: 3000, // 持续展示3S toast
        message: "操作中...",
        forbidClick: true, // 是否禁止背景点击
      });
      try {
        // 请求添加
        const res = await addComment({
          target: this.articleId, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: inputComment, // 评论内容
          // art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        });
        // console.log(res.data);
        // 将发布的最新评论展示到列表顶部
        //   this.list.unshift(res.data.data.new_obj);
        const result = res.data.data.new_obj;
        this.$EventBus.$emit("busAddComment", result);
        // 将发布的最新评论展示到列表顶部
        //传给ArticleComment组件
       
        this.inputComment = ""; // 清空文本框
        this.$emit('addCommentOne',1) //评论+1，更新底部菜单的评论总数
        this.$emit('postSucess',false)//关闭弹出层
         this.$toast.success('评论成功')
      } catch (error) {
        this.$toast.fail('请稍后重试')

      }
    },
  },
};
</script>

<style scoped lang='less'>
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>