module.exports = function (api) {
	api.cache(true);

	const presets = ['babel-preset-expo'];
	const plugins = [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		['@babel/plugin-proposal-class-properties', { loose: false }],
		['@babel/plugin-proposal-private-methods', { loose: false }],
	];

	return {
		presets,
		plugins,
	};
};
