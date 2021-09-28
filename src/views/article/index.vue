<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      left-arrow
      title="文章详情"
      @click-left="back"
    ></van-nav-bar>
    <!-- 导航栏 -->
    <div class="article-wrap">
    <!-- 文章标题 -->
    <h1 class="article-title">{{ article.title }}</h1>
    <!-- /文章标题 -->

    <!-- 用户信息 -->
    <van-cell class="user-info" center :border="false">
      <van-image
        class="avatar"
        slot="icon"
        round
        fit="cover"
        :src="article.aut_photo"
        height="1.2rem"
        width="1.2rem"
      />
      <div slot="title" class="user-name">{{ article.aut_name }}</div>
      <div slot="label" class="publish-date">
        {{ article.pubdate | relativeTime }}
      </div>
      <van-button
        class="follow-btn"
        :type="isFollowed ? 'default' : 'info'"
        round
        size="small"
        @click="onFollow"
      >
        {{ !isFollowed ? "关注" : "已关注" }}
      </van-button>
      <!-- <van-button
            class="follow-btn"
            round
            size="small"
          >已关注</van-button> -->
    </van-cell>
    <!-- /用户信息 -->

    <!-- 文章内容 -->



    <div
      class="article-conten markdown-body"
      ref="articleContents"
      v-html="article.content"
    >
      <!-- {{article.content}} -->
    </div>
    <!-- 文章内容 -->
    <van-divider>正文结束</van-divider>
   

    <!-- 评论列表 -->
  <article-comment 
  :source="articleId"
  @getTotalCount='commentTotal = $event'
   @click-reply="isReplyShow = true"
  ></article-comment>
    <!-- 评论列表 -->
 </div>

    <!-- 底部菜单 -->
    <div class="article-bottom">
      <van-button class="comment-btn" type="default" round size="small"
      @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon name="comment-o" :badge="commentTotal" color="#777" />
      <van-icon
        color="#ee0a24"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      />
      <van-icon 
      color="#ee0a24"
       :name="article.attitude=== 1 ? 'good-job' : 'good-job-o' "
       @click="onLike"
        />
      <van-icon name="share" color="#777777"></van-icon>
    </div>

    <!-- 底部菜单 -->

    <!-- 发布文章评论 -->
<van-popup
  v-model="isPostShow"
  position="bottom"
>
<comment-post
:articleId="articleId"
@postSucess='isPostShow = $event' 
@addCommentOne='addcommentTotal'
>
  </comment-post>
</van-popup>
<!-- /发布文章评论 -->

<!-- 评论回复 -->
<van-popup
  v-model="isReplyShow"
  position="bottom"
  style="height: 95%"
>
<comment-reply
  :comments="replyMessage"
  v-if='isReplyShow'
  :article-id='articleId'
  @click-close = 'isReplyShow = false'

>
  </comment-reply>
</van-popup>
<!-- /评论回复 -->

  </div>
</template>

<script>
//在组件中获取动态路由参数
//1.this.$route.params.articleId
//2.props传参
//this.articleId
import { NavBar, Cell, Button, Divider, Toast, Icon ,Popup} from "vant";
import { Image as VanImage } from "vant";
import { getArticleDetail } from "@/api/article";
import dayjs from "@/utils/dayjs";
import "github-markdown-css/github-markdown.css";
import { addFollow, deleteFollow, addCollect, deleteCollect,addLike,deleteLike } from "@/api/user";
import ArticleComment from './childcomps/ArticleComment.vue';
import CommentPost from './childcomps/commentPost.vue';
import CommentItem from './childcomps/CommentItem.vue';
import CommentReply from './childcomps/CommentReply.vue';

export default {
  name: "Article",
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [VanImage.name]: VanImage,
    [Button.name]: Button,
    [Divider.name]: Divider,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Popup.name]:Popup,
    ArticleComment,
    CommentPost,
    CommentItem,
    CommentReply,
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {},
      isFollowed: false,//
      isPostShow: false,//弹出层状态
      commentTotal:0, //评论总数
      isReplyShow: false,//回复的弹出层
      replyMessage:{}

    };
  },
  created() {
    this.getArticle();

     this.$EventBus.$on('clickReply',(message)=>{
        // 点击回复评论按钮，显示pop回复层
        this.isReplyShow = true,
        //接受评论项传过来的参数
        this.replyMessage = message
    })
    
  },
  methods: {
    //获取文章内容
    async getArticle() {
      const { data } = await getArticleDetail(this.articleId);
      this.article = data.data;
      this.isFollowed = data.data.is_followed;

      //  console.log(data);
    },
    async onFollow() {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: "操作中...",
        forbidClick: true, // 是否禁止背景点击
      });
      //已关注，取消关注
      // this.isFollowLoading = true
      try {
        if (this.isFollowed) {
          const { data } = await deleteFollow(this.article.aut_id);
          this.$toast.success("取消关注");
          this.isFollowed = false;
          //  }
        } else {
          //未关注，添加关注
          const { data } = await addFollow(this.article.aut_id);
          this.$toast.success("添加关注");
          this.isFollowed = true;
        }
      } catch (error) {
        this.$toast.fail("失败");
      }
    },
    async onCollect() {
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: "操作中...",
        forbidClick: true, // 是否禁止背景点击
      });
      try {
        //已收藏，取消收藏
        if (this.article.is_collected) {
          await deleteCollect(this.articleId);
          this.article.is_collected = false;
          this.$toast.success("取消收藏");
        } else {
          //未收藏，加收藏
          await addCollect(this.articleId);
          this.article.is_collected = true;
          this.$toast.success("添加收藏");
        }
      } catch (err) {
        this.$toast.fail("操作失败");
      }
    },
    async onLike () {
  // 两个作用：1、交互提示 2、防止网络慢用户连续不断的点击按钮请求
  this.$toast.loading({
    duration: 0, // 持续展示 toast
    message: '操作中...',
    forbidClick: true // 是否禁止背景点击
  })

  try {
    // 如果已经点赞，则取消点赞
    if (this.article.attitude === 1) {
      await deleteLike(this.articleId)
      this.article.attitude = -1
      this.$toast.success('取消点赞')
    } else {
      // 否则添加点赞
      await addLike(this.articleId)
      this.article.attitude = 1
      this.$toast.success('点赞成功')
    }
  } catch (err) {
    console.log(err)
    this.$toast.fail('操作失败')
  }
},
// 评论后总数加1 
addcommentTotal(message){
  this.commentTotal = this.commentTotal + message
},
back(){
  // console.log(this.$router);
  this.$router.back()
}


  },
};
</script>

<style scoped lang='less'>
.article-container {
  background-color: #fff;
  .article-title {
    font-size: 0.6rem;
    padding: 0.2rem;
  }
  .avatar {
    margin-right: 0.3rem;
  }
  .article-conten {
    padding: 0.4rem;
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
    .van-icon {
      font-size: 20px;
      .van-info {
        font-size: 11px;
        background-color: #e22829;
      }
    }
  }
  .article-wrap{
    position: fixed;
    left: 0;
    width: 100%;
    top: 50.78px;
    bottom: 48.78px;
    overflow-y: scroll;
    background-color: #fff;
  }
}
</style>