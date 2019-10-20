const {
	override,
	addDecoratorsLegacy,
	disableEsLint,
	addBabelPlugins,
	// addBabelPresets,
	useBabelRc,
	addBundleVisualizer,
	// addWebpackAlias,
	// adjustWorkbox,
	fixBabelImports,
	addLessLoader
} = require('customize-cra')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const addPlugins = () => config => {
	config.plugins.push(
		new ProgressBarPlugin({
			format:
				chalk.hex('#6c5ce7')('build ')
				+ chalk.hex('#0984e3')('﹝:bar﹞ ')
				// chalk.red('▯ :bar ▯ ') +
				+ chalk.hex('#00b894')('(:percent) ')
				// chalk.green(':percent ') +
				+ chalk.hex('#ffeaa7')(':msg'),
			// chalk.blue('( :elapsed s )')
			complete: '▰',
			incomplete: '▱',
			clear: false
		})
	)
	return config
}

module.exports = override(
	disableEsLint(),
	...addBabelPlugins(
		// 'polished',
		// 'emotion',
		// 'babel-plugin-transform-do-expressions',
		'@babel/plugin-transform-arrow-functions',
		'@babel/plugin-syntax-dynamic-import'
	),
	addBundleVisualizer(
		{
			analyzerMode: 'static',
			reportFilename: 'report.html'
		},
		true
	),
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	fixBabelImports('lodash', {
		libraryDirectory: '',
		camel2DashComponentName: false
	}),
	fixBabelImports('react-feather', {
		libraryName: 'react-feather',
		libraryDirectory: 'dist/icons'
	}),
	addDecoratorsLegacy(),
	useBabelRc(),
	// ...addBabelPresets([
	// 	['@babel/env'](
	// 		targets: {
	// 			browsers: ['> 1%', 'last 2 versions']
	// 		},
	// 		modules: 'commonjs'
	// 	),
	// 	'@babel/preset-flow',
	// 	'@babel/preset-react'
	// ]),
	// process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
	// addWebpackAlias({
	// 	['ag-grid-react$']: path.resolve(__dirname, 'src/shared/agGridWrapper.js')
	// }),
	// adjustWorkbox(wb =>
	// 	Object.assign(wb, {
	// 		skipWaiting: true,
	// 		exclude: (wb.exclude || []).concat('index.html')
	// 	})
	// ),
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: { '@primary-color': '#5871b1' }
	}),
	addPlugins()
)
