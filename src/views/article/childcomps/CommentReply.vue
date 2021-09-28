<template>
  <!-- 回复评论列表 -->
<div class="reply-container">
  <!-- 导航栏 -->
    <van-nav-bar :title="`${comments.reply_count}条回复`">
 

      <van-icon
        slot="left"
        name="cross"
        @click="$emit('click-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <comment-item
    :comments="comments"
    ></comment-item>
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <article-comment
    :source="comments.com_id"
    type="c"
    class="comments-list"
    ></article-comment>
    <!-- /评论的回复列表 -->

    <!-- 底部 -->

       <div class="article-bottom">
      <van-button class="comment-btn" type="default" round size="small"
      @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部 -->
    
    <!-- 发布回复评论 -->
    <van-popup
  v-model="isPostShow"
  position="bottom"
>
<comment-post
    :target='comments.com_id'
    :article-id="articleId"
 />
</van-popup>
    <!-- 发布回复评论 -->

</div>

</template>

<script>
import { NavBar,Cell,Icon,Button,Popup } from 'vant'
import CommentItem from './CommentItem.vue'
import ArticleComment from './ArticleComment.vue'
import CommentPost from './commentPost.vue'
export default {
    name:"CommentReply",
    components:{
        CommentItem,
        ArticleComment,
        CommentPost,
        [NavBar.name]:NavBar,
        [Cell.name]:Cell,
        [Icon.name]:Icon,
        [Button.name]:Button,
        [Popup.name]:Popup
            },
    props:{
        comments:{
            type:Object,
            required:true
        },
        articleId:{
            type:[Object,Number,String],
            required:true
        },

    },
    data(){
        return{
            isPostShow:false //弹出层
        }
    },
      created(){
    this.$EventBus.$on('busAddComment',(message)=>{
        // this.list.unshift(message);
        //关闭弹出层
        this.isPostShow = false

        //更新评论总数
        this.comments.reply_count ++

    })
    },

}
</script>

<style scoped lang='less'>
.comments-list{
    bottom: 44px;
}
.article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 141px;
      height: 23px;
      border: 1px solid #eeeeee;
      font-size: 15px;
      line-height: 23px;
      color: #a7a7a7;
    }
 
  }
</style>