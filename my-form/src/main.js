import Vue from 'vue'
import App from './App.vue'
import Message from './components/Message.vue';
import create from './utils';

Vue.prototype.$message = function(props) {
  const message = create(Message, props);
  message.show();
}

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
