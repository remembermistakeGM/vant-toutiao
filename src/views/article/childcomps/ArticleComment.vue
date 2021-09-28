<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
   
    <!-- 评论模块 -->
    <comment-item
     v-for="(comment,index) in list" 
     :key="index" 
     :comments='comment'
     
    >
   

    
    </comment-item>
    <!-- 评论模块 -->
  
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>
import {List,CellGroup,Field,Cell,Icon,Image} from 'vant'
import CommentItem from './CommentItem.vue';
import {getComments} from '@/api/comment'
  export default {
    name: "ArticleComment",
    components:{
        CommentItem,
        [List.name]:List,
        [CellGroup.name]:CellGroup,
        [Field.name]:Field,
        [Cell.name]:Cell,
        [Icon.name]:Icon,
        [Image.name]:Image
    }
    ,
    props: {
        source:{
              type: [Number, String, Object],
              required: true,
        },

        //获取文章评论是a，获取回复评论是c
        type:{
          type:String,
          default:'a'
        }
    },
    data() {
      return {
        list: [], // 评论列表
        loading: false, // 上拉加载更多的 loading
        finished: false, // 是否加载结束
        offset:null, //获取下一数据的页码
        limit:10 //每页10条
      };
    },
   created(){
   this.$EventBus.$on('busAddComment',(message)=>{
        // 将发布的最新评论展示到列表顶部
      // this.List.unshift(message)
      this.list.unshift(message);
    })
    },
    methods: {
     async onLoad() {
        // 异步更新数据
            //1.请求数据

            const { data } = await getComments ({
                //	评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
                // type:'a',
                type:this.type,
               // 源id，文章id或评论id 67798的文章有评论数据可以用来测试
                source:this.source.toString(),
                // source:67798,
 
                //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，
                //不传表示从第一页开始读取数据（页码）
                offset:this.offset,
                // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
                limit:this.limit
            })
            //2.把数据放到列表中
                // console.log(data);
                const {results} = data.data

                this.list.push(...results)
                // console.log(results);
          // 3.加载状态结束
          this.loading = false;

          // 4.数据全部加载完成
          if(results.length){
              //如果有数据
              this.offset = data.data.last_id
          }else{

         this.finished = true;

          }
          const res = data
          // console.log(res.data.total_count);
        //将list传给父组件
        this.$emit('getTotalCount',res.data.total_count)
       
      }
    }
  };
</script>

<style scoped lang="less">
  .publish-wrap {
    // position: fixed;
    // left: 0;
    // bottom: 0;
    // width: 100%;
  }

  .van-list {
    // margin-bottom: 45px;
  }
</style>