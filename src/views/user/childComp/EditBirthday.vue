<template>
  <div class="editbirthday-container">
      <!-- 生日 -->
      <van-datetime-picker
  v-model="currentDate"
  type="date"
  title="选择年月日"
  :min-date="minDate"
  :max-date="maxDate"
  @cancel="$emit('close')"
  @confirm = 'editBir'
/>
  </div>
</template>

<script>
import { DatetimePicker ,Toast} from 'vant';
import { editUserProfile } from "@/api/user";
import dayjs from 'dayjs'

export default {
    name:"EditBirthday",
    components:{
 [DatetimePicker.name]:DatetimePicker,
 [Toast.name]:Toast
    },
    props:{
        value:{
            type:String,
            required:true
        }
    }
    ,
      data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
    }
  },
  methods:{
     async editBir(){
         try {
             
        
          const date = dayjs(this.currentDate).format('YYYY-MM-DD');
          const data = await editUserProfile({
              birthday:date
          })
        this.$toast.success('修改成功');
       this.$emit('editedBrithday',date)
        } catch (error) {
        this.$toast.fail('请稍后重试');
                
         }
      }
  }


}
</script>

<style>

</style>