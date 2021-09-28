<template>
  <div class="search-article">
      <!-- 搜索历史 -->
      <van-cell title="搜索历史">
           <van-icon 
            v-if="!isDelete"
            name='delete'
            @click="isDelete = true"
           />
       <div class="item-span"  v-else>
          <span @click="allDelete">全部删除 </span>
          <span @click="isDelete = false">完成 </span>
       </div>
     
      </van-cell>

       <van-cell 
       v-for="(item,index) in history"
       :key="index"
       :title=item
       @click="deleteHistory(item,index)"
       >
        <van-icon
         name='close'
         v-if="isDelete"
         />
      </van-cell>
   
  </div>
</template>

<script>
import { Cell,Icon } from "vant";
import {setItem,getItem} from '@/utils/storage'
export default {
    name:"History",
    components:{
    [Cell.name]:Cell,
    [Icon.name]:Icon
    },
    data(){
      return{
        isDelete:false,
        history:[]
      }
    },
    props:{
      // history:{
      //   type:Array,
      //   required:false
      // }
    },
    methods:{
      deleteHistory(item,index){
      if(this.isDelete){
        //删除状态
        // 删除一条记录
        this.history.splice(index,1)

        // 数据持久化
        setItem('search-history',this.history)

      }else{
        //跳转状态
      // console.log('跳转');
      this.$emit('historyTo',item)
      }
      },
      allDelete(){
        //删除全部
        this.history=[];
         // 数据持久化
        setItem('search-history',this.history)
      }
      ,
      getStorege(){
        this.history=  getItem('search-history')
      }
    },
    created(){
        this.getStorege();
    }

}
</script>

<style scoped lang='less'>
.item-span span{
padding: 0 5px;
}

</style>