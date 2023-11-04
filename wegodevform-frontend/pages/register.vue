<template>
    <v-row>
      <v-col cols="10" offset="1" md="4" offset-md="4">
        <v-card>
          <v-toolbar dark color="primary">Register</v-toolbar>
          <v-card-text>
            <v-form ref="form">
              <v-text-field
              label="Name"
              :rules="rules.fullname"
              v-model="form.fullname"
              required 
              />
              <v-text-field 
              label="Email"
              :rules="rules.email"
              v-model="form.email"
              @keydown="resetEmailExistMessage"
              required
              />
              <v-text-field 
              label="Password"
              type="password"
              :rules="rules.password"
              v-model="form.password"
              required
              />
              <v-text-field 
              label="Confirm Password"
              type="password"
              :rules="rules.password_confirmation"
              v-model="form.password_confirmation"
              required
              />
              <!-- V CARD ACTION DIGUNAKAN UNTUK MELETAKAN BUTTON -->
               <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                color="primary"
                @click="onSubmit"
                :loading="isLoading">Register</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
        <div class="d-flex align-baseline"> 
          <p>Kamu Sudah Punya Akun ?</p>
          <v-btn
          text
          plain
          to="/login"
          :ripple="false"
          color="primary"
          class="pl-1"
          >
            Login </v-btn>
        </div>
      </v-col>
    </v-row>
</template>

<script>
  export default {
    middleware: ['unauthenticated'],
    layout: 'auth', // PENGGUNAAN TEMPLATE ATAU LAYOUT
    head() {
      return {
        title: 'Register'
      }
    },
    data() {
      return {
        emailExist: false,
        isLoading: false,
        form: {
          // DEFAULT VALUE DARI SETIAP FIELDS PADA FORM
          fullname: '',
          email: '',
          password: '',
          password_confirmation: '',
        },
        rules: {
          fullname: [
            (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'Fullname'}),
          ],
          email: [
            (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'E-mail'}),
            (v) => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(v) || this.$t('EMAIL_INVALID'),
            (v) => !this.emailExist || this.$t('EMAIL_EXIST', {field: 'E-mail'}), 

          ],
          password: [
            (v) => !!v || this.$t('FIELD_REQUIRED', {field: 'Password'}),
            // (v) => console.log(v) || 'Password must be at least 6 characters',
            (v) => v.length >= 6 || this.$t('FIELD_MIN', {field: 'Password', min: 6}),
          ],
          password_confirmation: [
            (v) => !!v  || this.$t('FIELD_REQUIRED', {field: 'Confirm Password'}),
            // THIS.FORM.PASSWORD -> VALUE PASSWORD YANG DIISI OLEH USER AKAN DISAMAKAN DENGAN VALUE CONFIRMATION PASSWORD
            (v) => v === this.form.password || this.$t('FIELD_CONFIRM', {fieldConfirm: 'Password Confirm', field: 'Password'})
          ]
        }
      }
    },
    methods: {
      resetEmailExistMessage() {
        this.emailExist = false
      },
      // ASYNCHRONUS -> MENDAPATKAN RESPONSE KE BACKEND SETELAH MELAKUKAN POST DATA
      async onSubmit() {
        try {
          if (this.$refs.form.validate()) // MENJALANKAN VALIDASI TERLEBIH DAHULU 
          {
            // ISLOADING NILAINYA AKAN DIUBAH KETIKA MELAKUKAN SUBMIT KETIKA VALIDASI BENAR IS LOADING DI SET MENJADI TRUE
            this.isLoading = true
            // SAMAKAN DENGAN ROUTES YANG ADA DI BACKEND
            // DATA YANG DIKIRIM KE BACKEND ADALAH this.form
            const response = await this.$axios.$post('/register', this.form)
            //console.log(response)
            if (response.message == 'USER_REGISTER_SUCCESSFULY') {
              /**
               * -> DATA ACCESS TOKEN, REFRESH TOKEN, FULLNAME DIDAPATKAN DARI FILE auth.js YANG ADA DI FOLDER store
               * -> MENGGUNAKAN GLOBAL STATE VUEX
               */

               /**
                *  MENGAKSES MUTATION DARI KOMPONEN
                */
              // MENYIMPAN DATA FULLNAME KE COOKIES
              this.$store.commit('auth/setFullname', response.fullname)
              // MENYIMPAN DATA ACCESS TOKEN KE COOKIES 
              this.$store.commit('auth/setAccessToken', response.accessToken)
              // MENYIMPAN DATA REFRESH TOKEN KE COOKIES
              this.$store.commit('auth/setRefreshToken', response.refreshToken)
              // KETIKA USER BERHASIL REGISTER AKAN DIANTARKAN KE HALAMAN DASHBOARD
              this.$router.push({ name: 'index___' + this.$i18n.locale }) // REDIRECT KE HALAMAN HOME

              //alert('register sukses')
            }

            // KETIKA VALIDASI TELAH SELESAI LOADING BUTTON AKAN DISET MENJADI FALSE
            // DAN USER DAPAT MENGINPUT KEMBALI 
            this.isLoading = false
          }
        } catch (error) {
          // console.log(error.response)
          if(error.response.data.message == 'EMAIL_ALREADY_EXISTS') {
            // alert('Email exist')
            this.emailExist = true
            this.$refs.form.validate()
          }

          this.isLoading = false
        }
          
      }
    }
  }
</script>
  