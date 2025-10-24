export function pick(obj: any, keys: Array<string>): object {
	const res: any = {};
	keys.forEach(k => {
		if (k in obj)
			res[k] = obj[k];
	});
	return res;
}

export function updateItemAtIndex<T>(index: number, newValue: T, arr: T[], setArr: (a: T[]) => void): void {
	const updatedArray = arr.map((item, i) =>
		i === index ? newValue : item
	);
	setArr(updatedArray);
}
