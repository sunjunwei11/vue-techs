<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <Form :model="formInfo" :rules="rules" ref="form">
      <FormItem prop="name" label="姓名">
        <Input v-model="formInfo.name"></Input>
      </FormItem>
      <FormItem prop="age" label="年龄">
        <Input v-model="formInfo.age"></Input>
      </FormItem>
      <FormItem>
        <button @click="submit">校验</button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import Form from './components/Form.vue'
import FormItem from './components/FormItem.vue'
import Input from './components/Input.vue'

export default {
  name: 'App',
  components: {
    Form,
    FormItem,
    Input
  },
  data() {
    return {
      formInfo: {
        name: '',
        age: 18
      },
      rules: {
        name: [
          { required: true, message: '需要输入名字' }
        ],
        age: [
          { required: true, message: '需要输入年龄' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate();
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
