<template>
  <v-toolbar class="px-1 px-md-2" flat>
    <v-toolbar-title>
      <v-btn
      text
      plain
      :ripple="false"
      class="pl-0 v-btn--active"
      to="/"
      >
        <p class="text-h5 mb-0"><strong>wegodev</strong>form</p>
      </v-btn>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu offset-y>
      <template v-slot:activator="{on}">
        <v-btn
        text
        v-on="on"
        class="v-btn--active"
        icon
        >
          <v-icon color="purple" large >mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item to="/logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>