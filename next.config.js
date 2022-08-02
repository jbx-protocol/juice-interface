// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')

module.exports = {
  staticPageGenerationTimeout: 90,
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, module: false }
    // Adds __DEV__ to the build to fix bug in apollo client `__DEV__ is not defined`.
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
      }),
    )

    return config
  },
  async redirects() {
    return [
      {
        source: '/p',
        destination: '/projects',
        permanent: true,
      },
      {
        source: '/v2/create',
        destination: '/create',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/@:projectId',
        destination: '/v2/p/:projectId',
      },
    ]
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
