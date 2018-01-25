import * as uuid from "uuid";
import { ActionContext, Store } from "vuex";
import apiBookmarks, { IFetchResult } from "../../api/bookmarks";
import { IState as RootState } from "../state";

export interface IId {
	id: string;
}

export interface IBookmark extends IId {
	url: string;
	title: string;
	author: string;
	date: Date;
	tags: string[];
}

export interface ISize {
	width: number;
	height: number;
}

export interface IDuration {
	duration: number;
}

export interface ISizeBookmark extends IBookmark, ISize {
}

export interface IVideoBookmark extends IBookmark, ISize, IDuration {
}

export interface IBookmarksState {
	addingItem: boolean;
	fetchingItems: boolean;
	items: Bookmark[];
	page: number;
	pages: number;
	removingItem: boolean;
	updatingItem: boolean;
}

export class Bookmark implements IId, IBookmark {
	public id: string;
	public url: string;
	public title: string;
	public author: string;
	public date: Date;
	public tags: string[];

	constructor(
		args: IBookmark,
	) {
		this.id = args.id;
		this.url = args.url;
		this.title = args.title;
		this.author = args.author;
		this.date = args.date;
		this.tags = args.tags;
	}

	public serialize(): IBookmark {
		return {
			author: this.author,
			date: this.date,
			id: this.id,
			tags: this.tags,
			title: this.title,
			url: this.url,
		};
	}

	public clone(): Bookmark {
		return new Bookmark(this.serialize());
	}

	public copy(bookmark: IBookmark) {
		this.author = bookmark.author;
		this.date = bookmark.date;
		this.id = bookmark.id;
		this.tags = bookmark.tags;
		this.title = bookmark.title;
		this.url = bookmark.url;
	}
}

class SizeBookmark extends Bookmark implements ISize {
	public width: number;
	public height: number;
	constructor(args: ISizeBookmark) {
		super(args);
		this.width = args.width;
		this.height = args.height;
	}
	public serialize(): ISizeBookmark {
		const o = super.serialize();
		return {
			...o,
			height: this.height,
			width: this.width,
		};
	}
	public clone(): SizeBookmark {
		return new SizeBookmark(this.serialize());
	}
	public copy(bookmark: ISizeBookmark) {
		super.copy(bookmark);
		this.width = bookmark.width;
		this.height = bookmark.height;
	}
}
export class PhotoBookmark extends SizeBookmark implements ISizeBookmark {
	constructor(args: ISizeBookmark) {
		super(args);
	}
	public clone(): PhotoBookmark {
		return new PhotoBookmark(this.serialize());
	}
}

export class VideoBookmark extends SizeBookmark implements IVideoBookmark {
	public duration: number;
	constructor(args: IVideoBookmark) {
		super(args);
		this.duration = args.duration;
	}
	public serialize(): IVideoBookmark {
		const o = super.serialize();
		return {
			...o,
			duration: this.duration,
		};
	}
	public clone(): VideoBookmark {
		return new VideoBookmark(this.serialize());
	}
	public copy(bookmark: IVideoBookmark) {
		super.copy(bookmark);
		this.duration = bookmark.duration;
	}
}

const rVimeo = /^(http|https)\:\/\/(www\.)?vimeo.com\/(.*)/gi;
const rFlickr = /^(http|https)\:\/\/(www\.)?flickr.com\/(.*)/gi;

export class BookmarkFactory {
	public static isVimeo(url: string) {
		rVimeo.lastIndex = 0;
		return rVimeo.test(url);
	}
	public static isFlickr(url: string) {
		rFlickr.lastIndex = 0;
		return rFlickr.test(url);
	}
	public static create(bookmark: IBookmark): null | PhotoBookmark | VideoBookmark {
		if (bookmark.id == null) {
			bookmark.id = uuid.v4();
		}
		if (BookmarkFactory.isVimeo(bookmark.url)) {
			return new VideoBookmark({
				...bookmark,
				duration: (bookmark as any).duration || 0,
				height: (bookmark as any).height || 0,
				width: (bookmark as any).width || 0,
			});
		} else if (BookmarkFactory.isFlickr(bookmark.url)) {
			return new PhotoBookmark({
				...bookmark,
				height: (bookmark as any).height || 0,
				width: (bookmark as any).width || 0,
			});
		}
		return null;
	}
}

export interface INotification {
	message: string;
}

type BookmarksContext = ActionContext<IBookmarksState, RootState>;

const bookmarksState: IBookmarksState = {
	addingItem: false,
	fetchingItems: false,
	items: [],
	page: 1,
	pages: 1,
	removingItem: false,
	updatingItem: false,
};

const getters = {
	getAddingItem: (state: IBookmarksState): boolean => {
		return state.addingItem;
	},
	getFetchingItems: (state: IBookmarksState): boolean => {
		return state.fetchingItems;
	},
	getItem: (state: IBookmarksState, id: string): Bookmark | undefined => {
		return state.items.find((bookmark) => {
			return bookmark.id === id;
		});
	},
	getItems: (state: IBookmarksState) => {
		return state.items;
	},
	getPage: (state: IBookmarksState) => {
		return state.page;
	},
	getPages: (state: IBookmarksState) => {
		return state.pages;
	},
	getRemovingItem: (state: IBookmarksState): boolean => {
		return state.removingItem;
	},
	getUpdatingItem: (state: IBookmarksState): boolean => {
		return state.updatingItem;
	},
};

// Export for unit-test
export const mutations = {
	addItemRequest(state: IBookmarksState) {
		state.addingItem = true;
	},
	addItem(state: IBookmarksState, bookmark: Bookmark) {
		state.items.unshift(bookmark);
	},
	addItemSuccess(state: IBookmarksState, bookmark: Bookmark) {
		state.addingItem = false;
	},
	addItemFail(state: IBookmarksState) {
		state.addingItem = false;
	},
	fetchItemsRequest(state: IBookmarksState, page: number) {
		state.fetchingItems = true;
	},
	fetchItemsSuccess(state: IBookmarksState, result: IFetchResult) {
		state.items = result.items;
		state.page = result.page;
		state.pages = result.pages;
		state.fetchingItems = false;
	},
	fetchItemsFail(state: IBookmarksState) {
		state.fetchingItems = false;
	},
	removeItemRequest(state: IBookmarksState) {
		state.removingItem = true;
	},
	removeItem(state: IBookmarksState, bookmark: Bookmark) {
		for (let index = 0; index < state.items.length; index++) {
			const item = state.items[index];
			if (item.id === bookmark.id) {
				state.items.splice(index, 1);
				break;
			}
		}
	},
	removeItemSuccess(state: IBookmarksState, bookmark: Bookmark) {
		state.removingItem = false;
	},
	removeItemFail(state: IBookmarksState) {
		state.removingItem = false;
	},
	setItems(state: IBookmarksState, items: Bookmark[]) {
		state.items = items;
	},
	updateItemRequest(state: IBookmarksState) {
		state.updatingItem = true;
	},
	updateItem(state: IBookmarksState, bookmark: Bookmark) {
		const found = getters.getItem(state, bookmark.id);
		if (found != null) {
			found.copy(bookmark);
		}
	},
	updateItemSuccess(state: IBookmarksState, bookmark: Bookmark) {
		state.updatingItem = false;
	},
	updateItemFail(state: IBookmarksState) {
		state.updatingItem = false;
	},
};

// Export for unit-test
export const actions = {
	addItem(context: BookmarksContext, bookmark: Bookmark) {
		context.commit(mutations.addItemRequest.name);
		context.commit(mutations.addItem.name, bookmark);
		return apiBookmarks.update(context.state)
			.then((state) => {
				context.commit(mutations.addItemSuccess.name, bookmark);
			})
			.catch((error) => {
				context.commit(mutations.addItemFail.name);
			});
	},
	clear(context: BookmarksContext) {
		return apiBookmarks.clear().then(() => {
			context.commit(mutations.setItems.name, []);
		});
	},
	createRandom(context: BookmarksContext, amount: number) {
		return apiBookmarks.addRandom(context.state, amount).then((items) => {
			context.commit(mutations.setItems.name, items);
		});
	},
	fetchItems(context: BookmarksContext, pagination: any) {
		context.commit(mutations.fetchItemsRequest.name);
		return apiBookmarks.fetch(pagination.page, pagination.perPage)
			.then((result) => {
				context.commit(mutations.fetchItemsSuccess.name, result);
			})
			.catch((error) => {
				context.commit(mutations.fetchItemsFail.name);
			});
	},
	removeItem(context: BookmarksContext, bookmark: Bookmark) {
		context.commit(mutations.removeItemRequest.name);
		context.commit(mutations.removeItem.name, bookmark);
		return apiBookmarks.update(context.state)
			.then((state) => {
				context.commit(mutations.removeItemSuccess.name, bookmark);
			})
			.catch((error) => {
				context.commit(mutations.removeItemFail.name);
			});
	},
	updateItem(context: BookmarksContext, bookmark: Bookmark) {
		context.commit(mutations.updateItemRequest.name);
		context.commit(mutations.updateItem.name, bookmark);
		return apiBookmarks.update(context.state)
			.then((state) => {
				context.commit(mutations.updateItemSuccess.name, bookmark);
			})
			.catch((error) => {
				context.commit(mutations.updateItemFail.name);
			});
	},
};

export const dispatchFetchItems = (store: Store<any>, page: number, perPage: number) => {
	return store.dispatch(actions.fetchItems.name, { page, perPage });
};
export const clear = (store: Store<any>) => {
	return store.dispatch(actions.clear.name);
};
export const createRandom = (store: Store<any>, amount: number) => {
	return store.dispatch(actions.createRandom.name, amount);
};
export const addBookmark = (store: Store<any>, bookmark: Bookmark) => {
	return store.dispatch(actions.addItem.name, bookmark);
};
export const removeBookmark = (store: Store<any>, bookmark: Bookmark) => {
	return store.dispatch(actions.removeItem.name, bookmark);
};
export const updateBookmark = (store: Store<any>, bookmark: Bookmark) => {
	return store.dispatch(actions.updateItem.name, bookmark);
};
export const getBookmarks = (store: Store<any>) => {
	return getters.getItems(store.state.bookmarks);
};
export const getBookmarksPage = (store: Store<any>) => {
	return getters.getPage(store.state.bookmarks);
};
export const getBookmarksPages = (store: Store<any>) => {
	return getters.getPages(store.state.bookmarks);
};
export const getBookmark = (store: Store<any>, id: string) => {
	return getters.getItem(store.state.bookmarks, id);
};
export const getFetchingBookmarks = (store: Store<any>) => {
	return getters.getFetchingItems(store.state.bookmarks);
};
export const getAddingBookmark = (store: Store<any>) => {
	return getters.getAddingItem(store.state.bookmarks);
};
export const getUpdatingBookmark = (store: Store<any>) => {
	return getters.getUpdatingItem(store.state.bookmarks);
};
export const getRemovingBookmark = (store: Store<any>) => {
	return getters.getRemovingItem(store.state.bookmarks);
};

export const bookmarks = {
	actions,
	getters,
	mutations,
	state: bookmarksState,
};
