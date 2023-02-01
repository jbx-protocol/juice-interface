const webpack = require('webpack')

const WALLET_CONNECT_URLS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.org',
].join(' ')

const ContentSecurityPolicy = `
  default-src 'none';
  script-src 'self' https://static.hotjar.com https://script.hotjar.com https://*.juicebox.money 'unsafe-inline' 'unsafe-eval';
  style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' https://*.juicebox.money https://juicebox.money https://*.infura-ipfs.io https://jbx.mypinata.cloud data:;
  connect-src 'self' https://*.juicebox.money https://juicebox.money https://*.infura.io https://*.infura-ipfs.io https://api.pinata.cloud https://jbx.mypinata.cloud https://api.studio.thegraph.com https://gateway.thegraph.com https://api.arcx.money https://api.tenderly.co https://*.hotjar.com https://*.hotjar.io wss://*.hotjar.com https://*.gnosis.io https://*.safe.global https://*.snapshot.org https://*.wallet.coinbase.com ${WALLET_CONNECT_URLS} https://juicenews.beehiiv.com;
  manifest-src 'self';
  prefetch-src 'self';
  frame-src 'self' https://vars.hotjar.com/ https://gnosis-safe.io https://app.safe.global;
`

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
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      },
    ]
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}
