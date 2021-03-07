const PrerenderSPAPlugin = require('prerender-spa-plugin');
const { join } = require('path');

const configureWebpack = {
  devtool: 'source-map',
};

if (process.env.NODE_ENV === 'productionn') {
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
        target: 'https://suvww6q09c.execute-api.ca-central-1.amazonaws.com/Prod',
        secure: true,
      },
    },
  },
};
