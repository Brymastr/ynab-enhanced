module.exports = {
  devServer: {
    host: 'localhost',
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
