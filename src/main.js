import Vue from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue';

Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  runtimeCompiler: true,
  render: h => h(App),
}).$mount('#app')
