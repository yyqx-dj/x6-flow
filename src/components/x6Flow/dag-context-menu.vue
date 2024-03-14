<template>
  <div 
    v-if="visible" 
    class="dag-context-menu"
    :style="{left: `${this.left}px`, top: `${this.top}px`}"
    >
     <div class="dag-menu-item" @click="handleEdit">编辑</div>
     <div class="dag-menu-item" @click="handleCopy">复制节点</div>
     <div class="dag-menu-item" @click="handleRemove">删除</div>
     <div class="dag-menu-item">查看日志</div>
  </div>
</template>

<script>
export default {
  name: "dag-context-menu",
  props: ["visible","left","top"],
  components:{
   
  },
  data() {
    return {
    };
  },
  methods:{
   handleCopy(){
     this.$emit('copyTask')
   },
   handleRemove(){
     this.$emit('remove')
   },
   handleEdit(){
     this.$emit('edit')
   }
  }
 
};
</script>
<style scoped>
.dag-context-menu {
  position: fixed;
  left: 0;
  top: 0;
  width: 100px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
}
.dag-menu-item {
    text-align: center;
    padding: 5px 10px;
    border-bottom: solid 1px #f2f3f7;
    color: rgb(89, 89, 89);
    font-size: 12px;
    width: 100%;
  }
</style>
