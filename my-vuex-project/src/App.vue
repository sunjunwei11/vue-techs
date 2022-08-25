<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>{{$store.state.count}}</div>
    <div>{{$store.getters.doubleCount}}</div>
    <button @click="addCount">add</button>
    
    <button @click="asyncAddCount">async add</button>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  methods: {
    addCount() {
      this.$store.commit('add', 2);
    },
    asyncAddCount() {
      this.$store.dispatch('add', 3);
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
