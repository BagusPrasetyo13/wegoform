export default function({$axios, redirect, store}) {
  // on.Request -> SEBELUM DATA DIKIRIM KE BACKEND SETTINGAN DIBAWAH AKAN DIJALANKAN
  $axios.onRequest(config => {
    if (store.state.auth.accessToken) {
      // SETTINGAN HEADERS UNTUK ACCESS TOKEN
      config.headers['Authorization'] = `Bearer ${store.state.auth.accessToken}` // DIAMBIL DARI STATE ACCESS TOKEN
    }
  })

  // on.ResponseError -> SETELAH TERJADI ERROR AKAN DI HANDLE DARI AXIOS
  $axios.onResponseError( async error => {
    try {
      if(error.response.status === 401 && error.response.data.message === 'ACCESS_TOKEN_EXPIRED') {
        let refreshToken = store.state.auth.refreshToken // DIAMBIL DARI STATE REFRESH TOKEN

        // 'refreshToken' -> VARIABLE PENAMPUNG DI ATAS -> let refreshToken
        // refreshToken -> MENGIRIMKAN DATA REFRESH TOKEN YANG ADA DI DALAM COOKIES 
        const response = await $axios.$post('/refresh-token', { 'refreshToken' : refreshToken })
        // console.log(response);

        // MENYIMPAN TOKEN BARU KE store/auth.js
        store.commit('auth/setAccessToken', response.accessToken)
        store.commit('auth/setRefreshToken', response.refreshToken)

        // REQUEST ULANG
        let originalRequest = error.config
        originalRequest.headers['Authorization'] = `Bearer ${response.accessToken}`
        return $axios(originalRequest)
      }
    } catch (error) {
      return redirect('/logout')
    }
  })
}