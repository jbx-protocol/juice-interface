/* eslint-disable no-undef */
// TODO come back and fix this with override
const webpack = require('webpack')

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  require('react-app-rewire-postcss')(config /*, options */)

  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    stream: require.resolve('stream-browserify'),
    zlib: require.resolve('browserify-zlib'),
    path: require.resolve('path-browserify'),
    tty: require.resolve('tty-browserify'),
    fs: require.resolve('browserify-fs'),
  })
  config.resolve.fallback = fallback

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ])
  config.ignoreWarnings = [/Failed to parse source map/]
  return config
}
