// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs')

const webpack = require('webpack')

const WALLET_CONNECT_URLS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.org',
]

const INFURA_IPFS_URLS = [
  'https://*.infura-ipfs.io',
  'https://ipfs.infura.io:5001',
]

const SCRIPT_SRC = [
  'https://static.hotjar.com',
  'https://script.hotjar.com',
  'https://*.juicebox.money',
]

const IMG_SRC = [
  'https://*.juicebox.money',
  'https://juicebox.money',
  ...INFURA_IPFS_URLS,
  'https://jbx.mypinata.cloud',
  'https://gateway.pinata.cloud',
  'https://cdn.stamp.fyi',
  'https://ipfs.io',
]

const CONNECT_SRC = [
  'https://*.juicebox.money',
  'https://juicebox.money',
  'https://*.infura.io',
  ...INFURA_IPFS_URLS,
  'https://api.pinata.cloud',
  'https://jbx.mypinata.cloud',
  'https://api.studio.thegraph.com',
  'https://gateway.thegraph.com',
  'https://api.arcx.money',
  'https://api.tenderly.co',
  'https://*.hotjar.com',
  'https://*.hotjar.io',
  'wss://*.hotjar.com',
  'https://*.gnosis.io',
  'https://*.safe.global',
  'https://*.snapshot.org',
  'https://*.wallet.coinbase.com',
  ...WALLET_CONNECT_URLS,
  'https://juicenews.beehiiv.com',
  'https://*.supabase.co',
  'https://api.ensideas.com',
  'https://*.sentry.io',
]
if (process.env.NODE_ENV === 'development') {
  CONNECT_SRC.push('localhost:*')
}

const ContentSecurityPolicy = `
  default-src 'none';
  script-src 'self' ${SCRIPT_SRC.join(' ')} 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
  img-src 'self' ${IMG_SRC.join(' ')}  data:;
  connect-src 'self' ${CONNECT_SRC.join(' ')};
  manifest-src 'self';
  prefetch-src 'self';
  frame-src 'self' https://vars.hotjar.com/ https://gnosis-safe.io https://app.safe.global;
  media-src 'self' https://jbx.mypinata.cloud ${INFURA_IPFS_URLS.join(' ')};
`

const nextConfig = {
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
  sentry: {
    hideSourceMaps: true,
  },
}

module.exports = withSentryConfig(nextConfig, { silent: true })
