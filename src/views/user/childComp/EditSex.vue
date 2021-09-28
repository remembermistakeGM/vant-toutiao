<template>
  <div class="sex-container">
      <!-- 性别 -->
      <van-picker
  title="性别"
  show-toolbar
  :columns="columns"
  @confirm="onConfirm"
  @cancel="$emit('close')"
  :default-index='defaultIndex'
/>
  </div>
</template>

<script>
import { Picker,Toast  } from "vant";
import { editUserProfile } from "@/api/user";



export default {
    name:"EditSex",
    components:{
    [Picker.name]:Picker,
    [Toast.name]:Toast 

    },
    props:{
        value:{
            type:Number,
            required:true
        }
        
    },
    data() {
    return {
      columns: ['男','女'],
      defaultIndex:this.value
    };
  },
  methods: {
     async onConfirm(value, index) {
      const data = await editUserProfile({
          gender:index
      })
      this.$toast.success('修改成功')
      this.$emit('editedSex',index)
    },

  },


}
</script>

<style>

</style>