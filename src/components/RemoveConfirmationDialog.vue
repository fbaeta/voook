<template>
<v-dialog
  max-width="500px"
  v-model="opened">
  <v-card
    @keyup.enter.stop="onDialogOk"
    @keyup.esc.stop="onDialogCancel">
    <v-card-title>Remove bookmark</v-card-title>
    <v-card-text>
      Do you really want to remove {{bookmarkTitle}} ?
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" flat @click.stop="onDialogOk">Remove</v-btn>
      <v-btn color="primary" flat @click.stop="onDialogCancel">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { IBookmark } from "../store/bookmarks/index";

@Component({
  name: "remove-confirmation-dialog"
})
export default class RemoveConfirmationDialog extends Vue {
  public bookmark: IBookmark | null;
  public opened = false;
  public bookmarkTitle = "";
  public open(bookmark: IBookmark) {
    this.bookmark = bookmark;
    this.bookmarkTitle = '"' + this.bookmark.title + '"';
    this.opened = true;
  }
  public onDialogOk() {
    this.opened = false;
    this.$emit("remove", this.bookmark);
    this.bookmark = null;
    this.bookmarkTitle = "";
  }
  public onDialogCancel() {
    this.opened = false;
    this.bookmark = null;
    this.bookmarkTitle = "";
  }
}
</script>
<style scoped>

</style>
