<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      Index
    </v-col>
  </v-row>
</template>

<script>
export default {
  
  middleware: ['authenticated'],
  //layout: 'default', // PEMANGGILAN TEMPLATE ATAU LAYOUT
  head() {
    return {
      title: 'Home'
    }
  },
  methods: {
    async fetchForms() {
      try {
        const response = await this.$axios.$get('/forms')
        console.log(response)

      } catch (error) {
        console.log(error.response);
      }
    }
  },
  mounted() {
    this.fetchForms()
  }
  
}
</script>
