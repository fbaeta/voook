
export function mock<T>(object: T, overrides: {[key: string]: any}): T {
	for (const key in overrides) {
		object[key] = overrides[key];
	}
	return object;
}

export function freeze(object: any, key: string) {
	const value = object[key];
	if (typeof value === "function") {
		const val = value();
		object[key] = () => {
			return val;
		};

	} else {
		Object.freeze(value);
	}
}
