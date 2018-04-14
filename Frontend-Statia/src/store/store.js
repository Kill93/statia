import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  token: null,
  user: '',
  userID: '',
  role: '',
}

const getters = {
  getToken: token => localStorage.getItem('token'),
  getUser: user => localStorage.getItem('user'),
  getUserID: userID => localStorage.getItem('userID'),
  getRole: role => localStorage.getItem('role')
}

const mutations = {
  addToken (state, payload) {
    state.token = payload.token1
    state.user = payload.user1
    state.userID = payload.userID1
    state.role = payload.role1
    localStorage.setItem('token', payload.token1)
    localStorage.setItem('user', payload.user1)
    localStorage.setItem('userID', payload.userID1)
    localStorage.setItem('role', payload.role1)
  },
  removeToken (state, n) {
    state.user='guest'
    state.token = null
    state.userID=''
    state.role=''
    localStorage.removeItem('role'),
    localStorage.removeItem('user'),
    localStorage.removeItem('userID')
    localStorage.removeItem('token')
    console.log('logged out' + state.user)
  }
}

const actions = {
  addToken: ({ commit }, payload) => commit('addToken'),
  removeToken: ({ commit }, payload) => commit('removeToken'),
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
