<template>
<v-card>
  <v-card-title>
    <h2>voook - Bookmark Manager</h2>
  </v-card-title>
  <v-card-text>
    <div>
      <h3>Features</h3>
      <ul class="ml-5">
        <li>Material Design</li>
        <li>vuejs</li>
        <li>vuex</li>
        <li>Typescript</li>
        <li>Webpack</li>
        <li>Local Storage Mock</li>
      </ul>
    </div>
  </v-card-text>
  <v-card-text>
    <div>
      <h3>Source Code</h3>
      <ul class="ml-5">
        <li><a href="https://github.com/fbaeta/voook" target="_blank">https://github.com/fbaeta/voook</a></li>
      </ul>
    </div>
  </v-card-text>
  <v-card-text>
    <div>
      <h3>To improve</h3>
      <ul class="ml-5">
        <li>Add unit tests</li>
        <li>Use flickr API to get tags on bookmark creation</li>
        <li>Use vimeo API to get tags on bookmark creation</li>
        <li>Optimistic UI</li>
        <li>Add undo for a removed bookmark</li>
        <li>Add detection for URL duplicates when adding</li>
        <li>Add i18n</li>
      </ul>
    </div>
  </v-card-text>
  <v-card-text>
    <div>Made in Rennes with <i class="fa fa-coffee"></i></div>
    <div>© Copyright 2018 Francesc BAETA</div>
    <div>
      <a href="https://github.com/fbaeta" target="_blank">
        <i class="fa fa-github"></i> fbaeta
      </a>
    </div>
  </v-card-text>
</v-card>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

@Component({
  name: "about",
  components: {}
})
export default class BookmarkList extends Vue {
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
i.fa {
  font-size: 16px;
}
</style>
