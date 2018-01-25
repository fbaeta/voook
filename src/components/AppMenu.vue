<template>
<v-list dense>
	<v-list-tile
		ripple
		v-for="item in items"
		:key="item.id"
		@click="goTo(item)">
		<v-list-tile-action>
			<v-icon>{{item.icon}}</v-icon>
		</v-list-tile-action>
		<v-list-tile-content>
			<v-list-tile-title>{{item.title}}</v-list-tile-title>
		</v-list-tile-content>
	</v-list-tile>
</v-list>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

interface MenuItem {
  id: string;
  icon: string;
  title: string;
}

@Component({
  name: "app-menu"
})
export default class AppMenu extends Vue {
  public items: MenuItem[] = [
    {
      id: "bookmarks",
      icon: "bookmark",
      title: "Bookmarks"
    },
    {
      id: "about",
      icon: "info",
      title: "About"
    },
    {
      id: "settings",
      icon: "settings",
      title: "Settings"
    }
  ];

  public goTo(item: MenuItem) {
    this.$router.push("/" + item.id);
  }
}
</script>

