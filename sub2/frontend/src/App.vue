<template>
  <v-app id="app">
    <toolbar />
    <drawer />
    <route-view />
    <go-top />
  </v-app>
</template>

<script>
import Drawer from "@/components/Drawer";
import Toolbar from "@/components/Toolbar";
import RouteView from "@/components/RouteView";
import GoTop from "@/components/GoTop";

export default {
  components: {
    Drawer,
    Toolbar,
    RouteView,
    GoTop
  },
};
</script>
