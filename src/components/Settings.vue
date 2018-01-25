<template>
<v-card>
  <v-card-title>
    <h2>Settings</h2>
  </v-card-title>
  <v-card-text>
    <v-btn @click="pushClick">Push&nbsp;<span>{{amount}}</span>&nbsp;Random Bookmarks</v-btn>
    <v-btn @click="clearClick">Clear Local Storage</v-btn>
  </v-card-text>
</v-card>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { dispatchFetchItems, clear, createRandom } from "../store/bookmarks";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

@Component({
  name: "settings",
  components: {}
})
export default class BookmarkList extends Vue {
  public amount = 33;
  public clearClick() {
    clear(this.$store).then(() => {
      this.$router.push("/bookmarks");
    });
  }
  public pushClick() {
    createRandom(this.$store, this.amount).then(() => {
      this.$router.push("/bookmarks");
    });
  }
  public beforeRouteEnter(to, from, next) {
    next();
  }

  public beforeRouteUpdate(to, from, next) {
    next();
  }

  public beforeRouteLeave(to, from, next) {
    next();
  }
}
</script>
<style scoped>

</style>
