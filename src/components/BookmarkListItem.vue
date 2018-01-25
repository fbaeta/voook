<template>
	<v-list-tile
		ripple
		@click="edit">
		<v-list-tile-content>
			<v-list-tile-title>{{bookmark.title}}</v-list-tile-title>
			<v-list-tile-sub-title>@{{bookmark.author}}</v-list-tile-sub-title>
			<v-list-tile-sub-title><a @click.stop="onUrlClik" :href="bookmark.url" target="_blank">{{bookmark.url}}</a></v-list-tile-sub-title>
		</v-list-tile-content>
		<v-list-tile-action>
			<v-list-tile-action-text>{{date}}</v-list-tile-action-text>
			<v-icon	@click.stop="remove">delete</v-icon>
		</v-list-tile-action>
	</v-list-tile>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { IBookmark, bookmarks } from "../store/bookmarks";
import * as moment from "moment";

@Component({
  name: "bookmark-list-item",
  props: {
    bookmark: Object
  }
})
export default class BookmarkListItemVM extends Vue {
  public bookmark: IBookmark;

  public onUrlClik() {}

  public edit() {
    this.$router.push("bookmarks/" + this.bookmark.id);
  }

  public remove() {
    this.$emit("remove", this.bookmark);
  }

  get date() {
    return moment(this.bookmark.date).fromNow(true);
  }
}
</script>
<style scoped>

</style>