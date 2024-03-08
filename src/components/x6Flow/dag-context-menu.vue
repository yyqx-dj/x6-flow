<template>
  <div class="context-menu">
     <div class="context-menu-item">1</div>
     <div class="context-menu-item">2</div>
     <div class="context-menu-item">3</div>
  </div>
</template>

<script>
export default {
  name: "dag-context-menu",
  components:{
   
  },
  data() {
    return {
    };
  },
  methods:{
   
  }
 
};
</script>
<style scoped>
.context-menu{
    width: 30px;
    height: 30px;
    border: 1px solid black;
}
.context-menu-item{
    height: 10px;
    border-bottom: 1px solid black;
}
</style>
