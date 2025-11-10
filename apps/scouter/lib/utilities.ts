export function pick(obj: any, keys: string[]): object {
	const res: any = {};
	keys.forEach(k => {
		if (k in obj)
			res[k] = obj[k];
	});
	return res;
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
	if (chunkSize === 0)
		return [array];
	const result = [];
	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize));
	}
	return result;
}

const possibleRandomStrChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function getRandomString(length: number, prefix = '') {
	let text = prefix;
	for (let i = 0; i < length; i++)
		text += possibleRandomStrChars.charAt(Math.floor(Math.random() * possibleRandomStrChars.length));

	return text;
}
