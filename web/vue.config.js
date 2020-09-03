const PrerenderSPAPlugin = require('prerender-spa-plugin');
const { join } = require('path');

const configureWebpack = {
  devtool: 'source-map',
};

if (process.env.NODE_ENV === 'production') {
  configureWebpack.plugins = [
    new PrerenderSPAPlugin({
      staticDir: join(__dirname, 'dist'),
      routes: ['/'],
    }),
  ];
}

module.exports = {
  configureWebpack,
  devServer: {
    hot: true,
    port: 8080,
    open: 'Chrome',
    proxy: {
      '/api/': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
};
