<template>
    <Flow />
</template>

<script>


import Monaco from "./components/Monaco";
import Flow from "./components/x6Flow";

export default {
  name: "App",
  components:{
    // Monaco,
    Flow
  },
  mounted() {
 },
  methods: {
    
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
