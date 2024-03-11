<template>
  <div class="dag-toolbar">
    <div class="dag-toolbar-left">
      <div>新建工作流</div>
    </div>
    <div class="dag-toolbar-right">
      <div class="dag-toolbar-item dag-button" @click="handleSearchInputVisible">搜索</div>
      <div
        class="dag-right-item node-selector"
        :class="[searchInputVisible ? 'visible' : '']"
      >
        <a-select style="width: 100%" @change="handleSelectChange">
          <a-select-option
            v-for="node in dropdownNodes"
            :key="node.value"
            :value="node.value"
          >
            {{ node.label }}
          </a-select-option>
        </a-select>
      </div>
      <div class="dag-toolbar-item dag-button" @click="handleDownload">下载</div>
      <div class="dag-toolbar-item dag-button" @click="handleRemove">删除</div>
      <div class="dag-toolbar-item dag-button" @click="handleFullScreen">全屏</div>
      <div class="dag-toolbar-item dag-button" @click="handleFormat">格式化</div>
      <div class="dag-toolbar-item dag-button" @click="handleSave">保存</div>
      <div class="dag-toolbar-item">关闭</div>
    </div>
  </div>
</template>

<script>
import { useFullscreen } from "@vueuse/core";
const { isFullscreen, toggle } = useFullscreen();
export default {
  name: "dag-toolbar",
  props: ["searchInputVisible", "dropdownNodes"],
  data() {
    return {};
  },
  methods: {
    handleSave() {
      this.$emit("save");
    },
    handleRemove() {
      this.$emit("remove");
    },
    handleDownload() {
      this.$emit("downloadPNG");
    },
    handleFullScreen() {
      toggle();
    },
    handleFormat() {
      this.$emit("format");
    },
    handleSelectChange(value) {
      console.log(value);
      this.$emit("navigateTo", value);
    },
    handleSearchInputVisible() {
      this.$emit("searchInputVisible");
    },
  },
};
</script>
<style scoped>
.dag-toolbar {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.dag-toolbar-left{
  width: 50%;
  padding-left: 10px;
  font-weight: 600;
}
.dag-toolbar-right{
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: end;
  font-size: 12px;
  
}
.dag-toolbar-item {
  margin-right: 10px;
  background: #eee;
  padding: 5px 8px;
  border-radius: 13px;
  
}
.dag-button{
  color: #1890ff;
  background: rgba(24, 144, 255, 0.16);
}
.dag-toolbar-item:hover {
  /* background: #288fff; */
  /* color: #fff; */
  cursor: pointer;
}
.toolbar-right-item {
  margin-right: 10px;
}
.node-selector {
  width: 0;
  overflow: hidden;
  transition: all 0.5s;
  margin-right: 0;
}
.visible {
  width: 200px;
  margin-right: 10px;
}
</style>

