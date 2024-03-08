<template>
  <div class="dag-toolbar">
    <div class="dag-toolbar-item">搜索</div>
    <div class="dag-toolbar-item">下载</div>
    <div class="dag-toolbar-item" @click="handleRemove">删除</div>
    <div class="dag-toolbar-item">全屏</div>
    <div class="dag-toolbar-item">格式化</div>
    <div class="dag-toolbar-item" @click="handleSave">保存</div>
    <div class="dag-toolbar-item">关闭</div>
  </div>
</template>

<script>
export default {
  name: "dag-toolbar",
  data() {
    return {
     
    };
  },
  methods:{
    handleSave(){
        this.$emit('save')
    },
    handleRemove(){
        this.$emit('remove')
    },
  }
 
};
</script>
<style scoped>
.dag-toolbar{
    display: flex;
    align-items: center;
}
.dag-toolbar-item{
    margin-right: 10px;
    background: #eee;
    padding: 5px 8px;
}
.dag-toolbar-item:hover{
   background: #288FFF;
   color: #fff;
   cursor: pointer;
}

</style>

