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
  fixBabelImports('antd', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#3f51b5' }
  }),
  addWebpackAlias({
    '@components': resolve(__dirname, './src/components'),
    '@constants': resolve(__dirname, './src/constants'),
    '@graphql': resolve(__dirname, './src/graphql'),
    '@misc': resolve(__dirname, './src/misc'),
    '@assets': resolve(__dirname, './src/assets'),
    '@pages': resolve(__dirname, 'src/pages'),
    '@stores': resolve(__dirname, 'src/stores'),
    '@routers': resolve(__dirname, 'src/routers'),
    '@utils': resolve(__dirname, 'src/utils'),
    '@tools': resolve(__dirname, 'src/tools'),
    '@interfaces': resolve(__dirname, './src/utils/interfaces')
  }),
  addPlugins()
)