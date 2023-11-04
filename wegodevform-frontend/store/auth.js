export const state = () => ({
  accessToken: null,
  refreshToken: null,
  fullname: null,
})

export const getters = {
  authenticated(state) {
    if(state.accessToken) {
      return true 
    }
    return false
  }
}

// MENGUBAH ACCESS TOKEN DARI GLOBAL STATE DI ATAS YANG SEBELUMNYA BERISIKAN null
export const mutations = {
  setFullname(state, fullname) {
    state.fullname = fullname
  },
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken
  },
  logout(state) {
    state.accessToken = null
    state.refreshToken = null
    state.fullname = null
  }
}

export const actions = {
  async login({commit}, payload) {
    const response = await this.$axios.post('/login', payload)
    if (!response) {
      return false
    }
    //console.log(response)
    // MENGAMBIL RESPONSE DATA DARI BACKEND DAN DIKEMBALIKAN KE MUTATIONS KE SETIAP FUNCTION
    // -> commit -> MENGUBAH NILAI fullname, accessToken, refreshToken const state MELALUI const actions commit()
    commit('setAccessToken', response.data.accessToken)
    commit('setRefreshToken', response.data.refreshToken)
    commit('setFullname', response.data.fullname)

    //console.log(response)
    return response // MENGEMBALIKAN DATA
  }
}
