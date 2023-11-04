import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false, // UNTUK MEMATIKAN SERVER SIDE RENDERING (BACKEND) DALAM MEMBUAT TAMPILAN AGAR TIDAK BERAT
  server: {
    port: 8000, // MENGGANTI PORT YANG SEBELUMNYA PORT:3000
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - WegodevForm', // NAMA DARI APLIKASI
    title: 'wegodevform-frontend', // NAMA DARI HALAMAN
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/scss/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/persistedState.js', mode: 'client' },
    { src: '~/plugins/axiosInterceptors.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/i18n',
  ],

  i18n: {
    langDir: 'lang/',
    defaultLocale: 'id',
    locales: [
      {code: 'id', name: 'Indonesia' ,iso: 'id-ID', file: 'id.json'},
      {code: 'en', name: 'English' ,iso: 'en-EN', file: 'en.json'},
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    prefix: process.env.SERVER_BACKEND,
    proxy: true
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    treeShake: true, // MENCARI SCRIPT YANG TIDAK DIGUNAKAN ATAU MENGHAPUS SCRIPT YANG TIDAK DIGUNAKAN
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
