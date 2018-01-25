<template>
<v-dialog
  max-width="500px"
  v-model="opened">
  <v-card
    @keyup.enter.stop="onDialogOk"
    @keyup.esc.stop="onDialogCancel">
    <v-card-title>Add bookmark</v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          ref="url"
          v-model="url"
          label="URL"
          placeholder="A vimeo or a flickr URL"
          required
          :rules="[urlRules.required, urlRules.url]">
        </v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" flat @click.stop="onDialogOk">Ok</v-btn>
      <v-btn color="primary" flat @click.stop="onDialogCancel">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { BookmarkFactory } from "../store/bookmarks";

const DEFAULT_URL = "";

@Component({
  name: "add-url-dialog"
})
export default class AddUrlDialog extends Vue {
  public opened = false;
  public url = DEFAULT_URL;
  public urlRules = {
    required: value => !!value || "Required.",
    url: value => {
      return (
        BookmarkFactory.isVimeo(value) ||
        BookmarkFactory.isFlickr(value) ||
        "The URL must be a vimeo or a flickr URL"
      );
    }
  };
  public onDialogOk() {
    const field = this.$refs.url as any;
    if (field.valid) {
      const b64 = window.btoa(this.url);
      this.reset();
      this.$router.push("/bookmarks/new/" + b64);
    } else {
      field.validate();
    }
  }
  public onDialogCancel() {
    this.opened = false;
    this.reset();
  }
  private reset() {
    const field = this.$refs.url as any;
    field.reset();
    this.url = DEFAULT_URL;
  }
}
</script>
<style scoped>

</style>
