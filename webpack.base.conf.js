var webpack = require('webpack')
module.exports = {
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
       $: "jquery",
       jQuery: "jquery",
       jquery: "jquery",
       "window.jQuery": "jquery"
        })
       ],
}