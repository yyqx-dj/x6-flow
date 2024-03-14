<template>
  <a-modal
    title="当前节点设置"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item label="节点名称">
        <a-input
        v-decorator="['name', { rules: [{ required: true, message: '请输入节点名称!' }] }]"
      />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "dag-node-data-modal",
  props: ["visible","flag"],
  components: {},
  watch:{
    // flag(value){
    //     if(value === 'edit')

    // }
  },
  data() {
    return {
      form: this.$form.createForm(this),
    };
  },
  methods: {
    handleOk() {
       this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
          this.$emit('addSubmit',values)
        }
      });
    },
    handleCancel() {
        this.$emit('addSubmit')
    },
   
  },
};
</script>
<style scoped>
</style>
