import Vuex from "vuex";
import { bookmarks } from "./bookmarks";
import { IState } from "./state";

export const createStore = () => new Vuex.Store<IState>({
	modules: {
		bookmarks,
	},
});
