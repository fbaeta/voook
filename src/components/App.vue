<template>
	<v-app>
		<v-navigation-drawer
			app
			dense
			clipped
			fixed
			v-model="drawerOpened">
			<AppMenu></AppMenu>
		</v-navigation-drawer>
		<v-toolbar
			app
			dense
			clipped-left
			color="pink"
			dark
			fixed>
			<v-toolbar-side-icon @click.stop="onToolbarSideIconClick"></v-toolbar-side-icon>
			<v-toolbar-title>{{title}}</v-toolbar-title>
		</v-toolbar>
		<v-content>
			<v-container>
				<router-view></router-view>
			</v-container>
		</v-content>
	</v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import AppMenu from "@/components/AppMenu.vue";

@Component({
  components: {
    AppMenu
  }
})
export default class App extends Vue {
  public title: string = "Voook";
  public drawerOpened: boolean = false;
  public onToolbarSideIconClick() {
    this.drawerOpened = !this.drawerOpened;
  }
}
</script>
<style scoped>

</style>
