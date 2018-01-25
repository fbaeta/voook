import About from "@/components/About.vue";
import BookmarkEdit from "@/components/BookmarkEdit.vue";
import BookmarkList from "@/components/BookmarkList.vue";
import Settings from "@/components/Settings.vue";
import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
	routes: [
		{
			path: "",
			redirect: "/bookmarks",
		},
		{
			component: BookmarkList,
			path: "/bookmarks",
		},
		{
			component: BookmarkEdit,
			name: "edit",
			path: "/bookmarks/:id",
		},
		{
			component: BookmarkEdit,
			name: "new",
			path: "/bookmarks/new/:url",
		},
		{
			component: Settings,
			path: "/settings",
		},
		{
			component: About,
			path: "/about",
		},
	],
});
