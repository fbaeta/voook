// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "es6-promise/auto";

import Vue from "vue";
import Vuetify from "vuetify";
import Vuex from "vuex";

import App from "@/components/App.vue";
import router from "./router";
import { createStore } from "./store";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(Vuex);

const store = createStore();

export const vue = new Vue({
	components: { App },
	el: "#app",
	router,
	store,
	template: "<App/>",
});
