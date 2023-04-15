<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-tabs centered>
        <v-tab to="/">Tree View 1</v-tab>
        <v-tab to="/tree-view-2">Tree View 2</v-tab>
        <v-tab to="/tree-view-3">Tree View 3</v-tab>
        <v-tab to="/tree-view-4">Tree View 4</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
