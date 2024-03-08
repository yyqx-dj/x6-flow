const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
 
module.exports = {
   lintOnSave: false, 
//     chainWebpack(config) {
//      config.plugin('monaco').use(new MonacoWebpackPlugin({ languages: ['javascript'] }))
//   },

  configureWebpack: {
    plugins: [
       new MonacoWebpackPlugin()
     ]
   }
};