const {
    addDecoratorsLegacy,
    override,
    disableEsLint,
    fixBabelImports,
    addLessLoader
} = require('customize-cra')

module.exports = {
    webpack: override(
        addDecoratorsLegacy(),
        disableEsLint(),
        fixBabelImports('antd', {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: true
        }),
        addLessLoader({
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#3f51b5' }
        })
    )
}