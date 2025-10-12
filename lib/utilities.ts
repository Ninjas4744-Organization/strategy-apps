export function pick(obj: any, keys: Array<string>): object {
	const res: any = {};
	keys.forEach(k => {
		if (k in obj)
			res[k] = obj[k];
	});
	return res;
}
