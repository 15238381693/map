import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
// import children from './modules/children'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app
    // children
  },
  getters
})

export default store
