import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

// ({store}) -> AGAR BISA MENGAKSES VUEX YANG ADA DI DALAM FOLDER STORE DI AUTH.JS
export default ({store, req}) => {
  createPersistedState({
    // paths[...] -> NAMA NAMA STATE YANG INGIN DISIMPAN KE DALAM COOKIES USER
    // SEBUTKAN NAMA FILE AUTH DI DALAM FOLDER STORE
    paths: ['auth.fullname', 'auth.accessToken', 'auth.refreshToken'],
    storage: {
      // getItem -> SCRIPT UNTUK MENGAMBIL DATA COOKIES 
      getItem: (key) => {
        if (process.server) {
          // CARA MENGAMBIL DATA COOKIES MENGGUNAKAN PROSES DI SERVER
          const parsedCookies = cookie.parse(req.headers.cookie)
          return parsedCookies[key] // LALU DI AKSES KEY NYA MASING MASING
        } else {
            return Cookies.get(key) // PROSES DARI CLIENT KEMUDIAN NAMA KEY FULLNAME, ACCESSTOKEN, REFRESHTOKEN
        }
      },
      // setItem -> DIGUNAKAN UNTUK MENYIMPAN KEY DAN VALUE
      // CONTOH -> key: fullname, accessToken, refreshToken
      // value -> DIDAPATKAN DARI BACKEND
      setItem: (key, value) =>
        Cookies.set(key, value, {expires: 365, secure: false }),
      removeItem: key => Cookies.remove(key) // KETIKA LOGOUT COOKIES AKAN DI HAPUS
    }
  })(store)
}