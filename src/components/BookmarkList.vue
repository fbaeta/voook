<template>
<div>
  <div class="loading-layer"
    v-if="loading">
    <v-btn
      class="loading-btn"
      depressed
      absolute
      circle
      fab>
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-btn>
  </div>
  <v-btn
    color="cyan"
    fab
    top
    right
    dark
    fixed
    @click.stop="$refs.addUrlDialog.opened = true"
  >
    <v-icon>add</v-icon>
  </v-btn>
  <add-url-dialog
    ref="addUrlDialog">
  </add-url-dialog>
  <remove-confirmation-dialog
    ref="removeConfirmationDialog"
    @remove="onRemoveConfirmationClick">
  </remove-confirmation-dialog>
  <div v-if="hasBookmarks">
      <v-list
        three-line>
        <bookmark-list-item
          v-for="(bookmark) in bookmarks"
          :key="bookmark.id"
          :bookmark="bookmark"
          @remove="onRemoveClick"/>
      </v-list>
      <div class="text-xs-center">
        <v-pagination
          v-model="page"
          :length="pages"
          @input="onPageInput"
          circle></v-pagination>
      </div>
  </div>
  <div class="title text-xs-center" v-if="!hasBookmarks">
    No bookmarks
  </div>
</div>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import {
  dispatchFetchItems,
  getBookmarks,
  getBookmarksPage,
  getBookmarksPages,
  getAddingBookmark,
  getFetchingBookmarks,
  getRemovingBookmark,
  getUpdatingBookmark,
  removeBookmark
} from "../store/bookmarks";
import AddUrlDialog from "@/components/AddUrlDialog.vue";
import RemoveConfirmationDialog from "@/components/RemoveConfirmationDialog.vue";
import BookmarkListItem from "@/components/BookmarkListItem.vue";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

@Component({
  name: "bookmarks",
  components: {
    AddUrlDialog,
    BookmarkListItem,
    RemoveConfirmationDialog
  }
})
export default class BookmarkList extends Vue {
  public loadingIndeterminate = true;
  private perPage = 5;

  public onRemoveClick(bookmark) {
    (this.$refs.removeConfirmationDialog as any).open(bookmark);
  }

  public onRemoveConfirmationClick(bookmark) {
    removeBookmark(this.$store, bookmark).then(() => {
      dispatchFetchItems(this.$store, this.page, this.perPage);
    });
  }

  public onPageInput(page) {
    dispatchFetchItems(this.$store, page, this.perPage);
  }

  public get page() {
    return getBookmarksPage(this.$store);
  }

  public set page(value: number) {
    // nothing
  }

  public get pages() {
    return getBookmarksPages(this.$store);
  }

  public get bookmarks() {
    return getBookmarks(this.$store);
  }

  public get hasBookmarks() {
    return this.bookmarks && this.bookmarks.length > 0;
  }

  public get loading() {
    return (
      this.addingBookmarks ||
      this.fetchingBookmarks ||
      this.removingBookmarks ||
      this.updatingBookmarks
    );
  }

  public get addingBookmarks() {
    return getAddingBookmark(this.$store);
  }

  public get fetchingBookmarks() {
    return getFetchingBookmarks(this.$store);
  }

  public get removingBookmarks() {
    return getRemovingBookmark(this.$store);
  }

  public get updatingBookmarks() {
    return getUpdatingBookmark(this.$store);
  }

  public beforeRouteEnter(to, from, next) {
    next(vm => {
      dispatchFetchItems(vm.$store, vm.page, vm.perPage);
    });
  }

  public beforeRouteUpdate(to, from, next) {
    next(vm => (vm.search = to.query.q));
  }

  public beforeRouteLeave(to, from, next) {
    next();
  }
}
</script>
<style scoped>
.loading-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
}
.loading-btn {
  margin-top: 100px;
  pointer-events: none;
}
</style>
