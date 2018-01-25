import * as uuid from "uuid";
import { Bookmark, BookmarkFactory, IBookmarksState, PhotoBookmark, VideoBookmark } from "../store/bookmarks/index";

const STORAGE_ID = "__voook__";

function createRandom(amount: number, offset = 0) {
	const items: any[] = [];
	for (let index = 0; index < amount; index++) {
		const num = index + offset + 1;
		const iBookmark: any = {
			author: "voook",
			date: new Date(),
			height: 600,
			id: uuid.v4(),
			tags: [],
			title: `Bookmark created automatically ${num}`,
			width: 800,
		};
		if (num % 2 === 0) {
			iBookmark.duration = 5000;
			iBookmark.url = `https://vimeo.com/${num}`;
		} else {
			iBookmark.url = `https://www.flickr.com/${num}`;
		}
		items.push(iBookmark);
	}
	return items;
}

function getPagination(array, page: number, perPage: number) {
	const pages = Math.ceil(array.length / perPage) || 1;
	if (page < 1) {
		page = 1;
	} else if (page > pages) {
		page = pages;
	}
	const index = (page - 1) * perPage;
	return {
		index,
		page,
		pages,
		perPage,
	};
}

function createResult(allItems: any[], aPage: number, aPerPage: number): IFetchResult {
	const items: Bookmark[] = [];
	const pagination = getPagination(allItems, aPage, aPerPage);
	const { index, page, pages, perPage } = pagination;
	let i = index;
	while (items.length < perPage && i < allItems.length) {
		const item = allItems[i];
		const b = BookmarkFactory.create(item);
		if (b != null) {
			items.push(b);
		}
		i++;
	}
	fetchedIndex = index;
	fetchedItemsLength = items.length;
	return {
		items,
		page,
		pages,
	};
}

export interface IFetchResult {
	items: Bookmark[];
	page: number;
	pages: number;
}

/**
 * Mocking client-server processing
 */
const DELAY = 0;
let allItems: any[] = [];
let fetchedIndex;
let fetchedItemsLength;
const API = {
	async fetch(page: number, perPage: number) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					const value = window.localStorage.getItem(STORAGE_ID);
					const store = (value != null) ? JSON.parse(value) : {};
					if (store.items != null) {
						allItems = store.items;
					}
					const result = createResult(allItems, page, perPage);
					resolve(result);
				} catch (error) {
					reject(error);
				}
			}, DELAY);
		});
	},

	async update(store: IBookmarksState) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				try {
					const items = [...store.items];
					if (fetchedIndex != null && fetchedItemsLength != null) {
						allItems.splice(fetchedIndex, fetchedItemsLength, ...store.items);
					}
					store.items = allItems;
					window.localStorage.setItem(STORAGE_ID, JSON.stringify(store));
					store.items = items;
					resolve();
				} catch (error) {
					reject(error);
				}
			}, DELAY);
		});
	},

	async addRandom(store: IBookmarksState, amount: number) {
		return new Promise((resolve, reject) => {
			try {
				allItems = [
					...allItems,
					...createRandom(amount, allItems.length),
				];
				API.update(store).then(resolve, reject);
			} catch (error) {
				reject(error);
			}
		});
	},

	async clear() {
		return new Promise((resolve, reject) => {
			try {
				allItems = [];
				window.localStorage.removeItem(STORAGE_ID);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	},
};

export default API;
