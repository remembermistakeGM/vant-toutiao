<template>
  <div class="comment-item">

 <van-cell>
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="comments.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{comments.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{comments.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{ comments.pubdate | relativeTime}}</span>
            <van-button 
            size="mini" 
            type="default"
            @click="onReply(comments)"
            >
              回复 
              <span>{{comments.reply_count}}</span></van-button>
          </p>
        </div>
        <van-icon slot="right-icon" 
        :name="comments.is_liking ? 'good-job' : 'good-job-o'"
         color='red'
         size='19'
         @click="onLike()"
         />
         <span class="like-count">{{comments.like_count}}</span>
      </van-cell> 
    

  </div>
</template>
<script>
import {List,CellGroup,Field,Cell,Icon,Image,Button,Toast} from 'vant'
import {addCommentLike,deleteCommentLikeLikings} from '@/api/comment.js'
import dayjs from '@/utils/dayjs'



export default {
    name:"CommentItem",
     components:{
        [List.name]:List,
        [CellGroup.name]:CellGroup,
        [Field.name]:Field,
        [Cell.name]:Cell,
        [Icon.name]:Icon,
        [Image.name]:Image,
        [Button.name]:Button,
        [Toast.name]:Toast
    },
    props:{
        comments:{
            type:[Array,Object],
            required:true
        }
    },
 
    methods:{
     async onLike(){
    this.$toast.loading({
    duration: 0, // 持续展示 toast
    message: '操作中...',
    forbidClick: true // 是否禁止背景点击
  })
        //如果没点赞，点赞
        // console.log(this.comments.is_liking);
        try {
     
        if(!this.comments.is_liking){
         await addCommentLike(this.comments.com_id)
         this.comments.like_count++
          this.$toast.success('点赞成功')
        }else{
      //如果点赞了，取消点赞
        await deleteCommentLikeLikings(this.comments.com_id)
              this.comments.like_count--
          this.$toast.success('取消点赞')
   

        }
       this.comments.is_liking = !this.comments.is_liking

        } catch (error) {
       
        this.$toast.fail('操作失败')
       
        }
      },
      //点击回复
      onReply(comment){
       this.$EventBus.$emit("clickReply",comment);
      }
    }


}
</script>

<style scoped lang='less'>
.like-count{
    display: block;
    margin: 0px 12px -0px 0px;
}



</style>