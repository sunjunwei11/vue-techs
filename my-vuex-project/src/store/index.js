import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from 'gapj-vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 1
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    }
  },
  mutations: {
    add(state, num) {
      state.count = state.count + num
    }
  },
  actions: {
    add({ commit }, payload) {
      setTimeout(() => {
        commit('add', payload);
      }, 1000);
    }
  },
  modules: {
  }
})
