/* eslint-disable global-require */
const { resolve } = require('path')
const webpack = require('webpack')
const {
  override,
  addDecoratorsLegacy,
  addBabelPlugins,
  fixBabelImports,
  addLessLoader,
  addWebpackAlias
} = require('customize-cra')
const WebpackBar = require('webpackbar')


const addPlugins = () => config => {
  config.plugins.push(
    new WebpackBar({
      color: '#faad14',
      name: '❖'
    }),
    require('autoprefixer'),
    new webpack.ProvidePlugin({
      'window.less': 'less'
    })
  )
  Object.assign(config, {
    devtool: process.env.SOURCE_MAP ? 'source-map' : false,
    optimization: {
      ...config.optimization,
      namedModules: true,
      namedChunks: true,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: { default: false }
      }
    }
  })
  return config
}

module.exports = override(
  addDecoratorsLegacy(),
  ...addBabelPlugins(
    '@babel/plugin-transform-spread',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-syntax-dynamic-import'
  ),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#3f51b5' }
  }),
  addWebpackAlias({
    '@assets': resolve(__dirname, './src/assets')
  }),
  addPlugins()
)