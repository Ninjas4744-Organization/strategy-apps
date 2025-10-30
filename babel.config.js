module.exports = function (api) {
	const presets = ['babel-preset-expo'];
	const plugins = api.env('BABEL_ENV') === 'web' ? [
		['@babel/plugin-proposal-decorators', { version: '2023-05' }],
		['@babel/plugin-proposal-class-properties', { loose: true }],
		['@babel/plugin-proposal-private-methods', { loose: true }],
	] : [];

	api.cache(true);

	return {
		presets,
		plugins,
	};
};
