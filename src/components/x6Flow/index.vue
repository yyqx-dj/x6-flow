<template>
  <div style="width: 100%; height: 100%;">
    <div class="dag-toolbar">
      <dag-toolbar 
         @save="onSave"
         @remove="onRemove"
      />
    </div>
    <div class="dag-content">
      <dag-sidebar @dragstart="handleDragStart"></dag-sidebar>
      <dag-canvas ref="canvas" :addNodeItem="addNodeItem"></dag-canvas>
    </div>
  </div>
</template>

<script>
import dagSidebar from './dag-sidebar.vue'
import dagCanvas from './dag-canvas.vue';
import dagToolbar from './dag-toolbar.vue';

export default {
  name: "flow",
  components:{
    "dag-canvas": dagCanvas,
    "dag-sidebar": dagSidebar,
    "dag-toolbar": dagToolbar,
  },
  data() {
    return {
      addNodeItem: {},
      graph: null,
    };
  },
  methods:{
    handleDragStart({e,node}){
      console.log('拖拽开始',e,node)
      this.addNodeItem = node
      
    },
    onSave(){
       console.log(this.$refs.canvas)
       this.$refs.canvas.onSave()
    },
    onRemove(){
       console.log(this.$refs.canvas)
       this.$refs.canvas.onRemove()
    },
  }
 
};
</script>
<style scoped>
.dag-toolbar{
  width: 100%;
  height: 50px;
  /* background: yellow; */
  border-bottom: 1px solid black;
}
.dag-content{
  width: 100%;
  height: calc(100% - 50px);
  /* background: pink; */
  display: flex;
  padding: 10px;
  box-sizing: border-box;
}
</style>
