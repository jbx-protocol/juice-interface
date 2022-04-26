const webpack = require('webpack')

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {})
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
