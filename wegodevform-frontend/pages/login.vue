<template>
  <v-row>
      <v-col cols="10" offset="1" md="4" offset-md="4">
        <v-card>
          <v-toolbar dark color="primary">Login</v-toolbar>
          <v-card-text>
            <!-- v-if="message != null" UNTUK MENAMPILKAN PESAN ERROR JIKA NILAI MESSAGE ADA-->
            <!-- JIKA v-if="message == null" BOX MESSEGE TIDAK TAMPIL-->
            <!-- 
              <v-alert color="red lighten-2" dark v-if="message != null">
              {{ message }}
            </v-alert> 
            -->
            <!-- dark v-if="isError" MESSAGE ERROR MENGGUNAKAN DATA -->
            <v-alert color="red lighten-2" dark v-if="isError">
              {{ $t(message) }}
            </v-alert>

            <v-form ref="form">
              <v-text-field 
              label="E-mail"
              :rules="rules.email"
              v-model="form.email"
              required
              />
              <v-text-field 
              label="Password"
              type="password"
              :rules="rules.password"
              v-model="form.password"
              required
              />
              <!-- V CARD ACTION DIGUNAKAN UNTUK MELETAKAN BUTTON -->
               <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                color="primary"
                @click="onSubmit"
                :loading="isLoading">Login</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
        <div class="d-flex align-baseline"> 
          <p>Kamu Belum Punya Akun ?</p>
          <v-btn
          text
          plain
          :to="localePath('/register')"
          :ripple="false"
          color="primary"
          class="pl-1"
          >
            Register </v-btn>
        </div>
        <!-- <p>nama kamu : {{ fullname }}</p>  -> PENGGUNAAN GLOBAL STATE -->
      </v-col>
    </v-row>
</template>

<script>

// import { mapState } from 'vuex' -> pemanggilan library mapState

export default {
    middleware: ['unauthenticated'],
    layout: 'auth', // PENGGUNAAN TEMPLATE ATAU LAYOUT
    head() {
      return {
        title: 'Login'
      }
    },
    data() {
      return {
        isError: false, // MESSAGE ERROR
        message: null,
        isLoading: false,
        form: {
          // DEFAULT VALUE DARI SETIAP FIELDS PADA FORM
          email: '',
          password: '',
        },
        rules: {
          email: [
            (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'E-mail'}),
            (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v) || this.$t('EMAIL_INVALID'),

          ],
          password: [
            (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'Password'}),
            // (v) => console.log(v) || 'Password must be at least 6 characters',
            (v) => v.length >= 6 || this.$t('FIELD_MIN', {field: 'Password', min: 6}),
          ],
        }
      }
    },
    methods: {
      async onSubmit() {
        try {
          this.isLoading = true

          //this.$refs.form.validate() // -> MENJALANKAN VALIDASI ATAU PENGECEKAN TERLEBIH DAHULU

          const user = await this.$store.dispatch('auth/login', this.form) // MENGAKSES cont actions di store/auth.js
          //console.log(user)
          //alert(user.data.fullname)

          this.$router.push({ name: 'index___' + this.$i18n.locale }) // REDIRECT KE HALAMAN HOME
          this.isLoading = false
        } catch (error) {
          // console.log(error.response)

          this.isError = true // UNTUK MESSAGE ERROR
          this.isLoading = false 
          
          this.message = error.response ? error.response.data.message : "SERVER_ERROR" // local state untuk alert

        }
      }
    },
    /**
     * -> PEMANGGILAN GLOBAL STATE MELALUI HALAMAN LOGIN MENGGUNAKAN mapState
     * computed: {
      ...mapState('auth', ['fullname'])
      }
     */
  }
</script>