<template>
  <v-app-bar id="app-toolbar" app flat color="blue lighten-1">
    <v-btn v-if="responsive" dark icon @click.stop="onClickDrawer">
      <v-icon>mdi-view-list</v-icon>
    </v-btn>
    <v-spacer />
  </v-app-bar>
</template>

<script>
import { mapMutations, mapState } from "vuex";

export default {
  data: () => ({
    responsive: false
  }),
  computed: {
    ...mapState("app", ["drawer"])
  },
  mounted() {
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  },

  methods: {
    ...mapMutations("app", ["setDrawer"]),
    onClickDrawer() {
      this.setDrawer(!this.drawer);
    },
    onResponsiveInverted() {
      if (window.innerWidth < 900) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    }
  }
};
</script>
