const state = {
  childrenIdentify: false
}
const mutations = {
  SET_IDNENTIFY(state, data) {
    state.childrenIdentify = data
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions: {}
}
