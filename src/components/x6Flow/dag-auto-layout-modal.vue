<template>
  <a-modal
    title="格式化"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="布局类型">
        <a-radio-group v-decorator="['type']" @change="handleFormLayoutChange">
          <a-radio-button value="grid"> 网格布局 </a-radio-button>
          <a-radio-button value="dagre"> 层次布局 </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <template v-if="type === 'grid'">
        <a-form-item label="行数" >
          <a-input-number v-decorator="['rows']" :min="0" style="width: 200px" />
        </a-form-item>
        <a-form-item label="列数" >
          <a-input-number v-decorator="['cols']" :min="0" style="width: 200px" />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "dag-format-modal",
  props: ["visible","layoutFormValue"],
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      type: this.layoutFormValue.type,
    };
  },
  methods: {
    handleOk() {
       this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.$emit('submit',values)
        }
      });
    },
    handleCancel() {
        this.$emit('submit')
    },
    handleFormLayoutChange(e) {
      console.log(e);
      this.type = e.target.value;
    },
  },
};
</script>
<style scoped>
</style>
