<template>
  <div style="width: 100%; height: 100%;">
    <div class="dag-toolbar">
      <dag-toolbar 
         @save="onSave"
         @remove="onRemove"
         @downloadPNG="onDownloadPNG"
         @format="onFormat"
         @searchInputVisible="onSearchInputVisible"
         @navigateTo="navigateTo"
         :searchInputVisible="searchInputVisible"
         :dropdownNodes="dropdownNodes"

      />
    </div>
    <div class="dag-content">
      <dag-sidebar @dragstart="handleDragStart"></dag-sidebar>
      <dag-canvas 
      ref="canvas" 
      :addNodeItem="addNodeItem" 
      :layoutFormValue="layoutFormValue"
      :searchSelectValue="searchSelectValue"
      @getDropdownNodes="getDropdownNodes"
      @handleEditNodeItem="handleEditNodeItem"
      ></dag-canvas>
    </div>


    <dag-auto-layout-modal 
    :visible="layoutVisible" 
    :layoutFormValue="layoutFormValue"
    @submit="onSubmit"/>


    <!-- <dag-node-data-modal 
      ref="nodeDataModal"
     :visible="addNodeVisible" 
     @addSubmit="onAddSubmit"
    /> -->
  </div>
</template>

<script>
import dagSidebar from './dag-sidebar.vue'
import dagCanvas from './dag-canvas.vue';
import dagToolbar from './dag-toolbar.vue';
import dagAutoLayoutModalVue from './dag-auto-layout-modal.vue';
import dagNodeDataModalVue from './dag-node-data-modal.vue';
// import './dag-module.scss';

export default {
  name: "flow",
  components:{
    "dag-canvas": dagCanvas,
    "dag-sidebar": dagSidebar,
    "dag-toolbar": dagToolbar,
    "dag-auto-layout-modal": dagAutoLayoutModalVue,
    "dag-node-data-modal": dagNodeDataModalVue,
  },
  data() {
    return {
      addNodeItem: {},
      graph: null,
      layoutVisible: false,
      layoutFormValue: {},
      searchInputVisible: false,
      dropdownNodes:[],
      searchSelectValue: '',
      addNodeVisible: false,
     
    };
  },
  methods:{
    handleDragStart({e,node}){
      console.log('拖拽开始',e,node)
      this.addNodeItem = node
            
    },
    handleEditNodeItem(values){
      this.addNodeItem = {...values}
    },
    onSave(){
       console.log(this.$refs.canvas)
       this.$refs.canvas.onSave()
    },
    onRemove(){
       console.log(this.$refs.canvas)
       this.$refs.canvas.onRemove()
    },
   onDownloadPNG (){
    this.$refs.canvas.onDownload()
    },
    onFormat(){
      this.layoutVisible=true
    },
    onSubmit(formValue){
      console.log(formValue)
      this.layoutVisible = false
      this.layoutFormValue = {...formValue}
      this.$nextTick(()=>{
        this.$refs.canvas.format()
      })
       
    },
  
    onSearchInputVisible(){
      this.searchInputVisible = !this.searchInputVisible;
      this.$refs.canvas.getAllNodes()
    },
    getDropdownNodes(nodes){
      this.dropdownNodes = nodes.map((node) => ({
        label: node.getData().name,
        value: node.id
      }))
    },
    navigateTo(value){
      this.searchSelectValue = value
      this.$nextTick(()=>{
      this.$refs.canvas.navigateTo()
 
      })
    }
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
