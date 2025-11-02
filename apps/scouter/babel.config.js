module.exports = function (api) {
	const presets = ['babel-preset-expo'];
	const plugins = api.env('process.env.IS_WEB') ? [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
		['@babel/plugin-proposal-private-methods', { loose: true }],
	] : [];

	api.cache(true);

	return {
		presets,
		plugins,
	};
};
