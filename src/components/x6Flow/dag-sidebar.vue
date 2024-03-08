<template>
  <div class="dag-sidebar">
     <div 
     class="dag-node"
     v-for="node in nodeTypeList"
     :key="node.id"
     draggable='true'
     @dragstart="onDragStart($event,node)"
     >
     <span><img src="https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*k4eyRaXv8gsAAAAAAAAAAAAADtOHAQ/original" alt=""></span>
     &nbsp; &nbsp; &nbsp;
     <span>{{node.data.name}}</span>
     </div>
  </div>
</template>

<script>
import { nodeType } from './data.js'
export default {
  name: "sidebar",
  data() {
    return {
      nodeTypeList: nodeType,
    };
  },
  methods:{
    onDragStart(e,node){
      //  e.dataTransfer.setData("Text",e.target.id);
      this.$emit('dragstart',{e,node})
    }
  }
 
};
</script>
<style scoped>
.dag-sidebar{
  width: 15%;
  height: 100%;
  /* background: red; */
  border-right: 1px solid black;
}
.dag-node{
    display: flex;
    width: 100%;
    height: 32px;
    margin-bottom: 10px;
    align-items: center;
    padding: 0 10px;
    border-radius: 4px;
    transform: translate(0);
    box-sizing: border-box;
    cursor: move;
    font-size: 12px;
    border: 1px solid #eee;
}

</style>

