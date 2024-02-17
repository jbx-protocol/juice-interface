const withBundleAnalyzer = require('@next/bundle-analyzer')
const linguiConfig = require('./lingui.config')

const webpack = require('webpack')

const removeImports = require('next-remove-imports')({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: '\\.(less|css|scss|sass|styl)$',
})

const WALLET_CONNECT_URLS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.org',
  'wss://*.walletconnect.com',
]

const INFURA_IPFS_URLS = [
  'https://*.infura-ipfs.io',
  'https://ipfs.infura.io:5001',
]

const SCRIPT_SRC = [
  'https://*.juicebox.money',
  'https://static.hotjar.com',
  'https://script.hotjar.com',
  'https://cdn.usefathom.com',
  // Not working as unsafe-eval is required for metamask
  // `'sha256-kZ9E6/oLrki51Yx03/BugStfFrPlm8hjaFbaokympXo='`, // hotjar
  `'unsafe-eval'`, // hotjar
  `'unsafe-inline'`, // MetaMask
]

const STYLE_SRC = [
  `'unsafe-inline'`, // NextJS, hotjar
]

const IMG_SRC = [
  'https://*.juicebox.money',
  'https://juicebox.money',
  ...INFURA_IPFS_URLS,
  'https://jbx.mypinata.cloud',
  'https://gateway.pinata.cloud',
  'https://cdn.stamp.fyi',
  'https://ipfs.io',
  'https://cdn.discordapp.com',
  'https://cdn.usefathom.com',
  '*.walletconnect.com',
]

const CONNECT_SRC = [
  'https://subgraph.satsuma-prod.com',
  'https://*.juicebox.money',
  'https://juicebox.money',
  'https://*.infura.io',
  ...INFURA_IPFS_URLS,
  'https://api.pinata.cloud',
  'https://jbx.mypinata.cloud',
  'https://api.studio.thegraph.com',
  'https://gateway.thegraph.com',
  'https://api.tenderly.co',
  'https://*.hotjar.com',
  'https://*.hotjar.io',
  'wss://*.hotjar.com',
  'https://*.safe.global',
  'https://*.snapshot.org',
  'https://*.wallet.coinbase.com',
  'wss://www.walletlink.org/rpc', // Coinbase
  ...WALLET_CONNECT_URLS,
  'https://*.supabase.co',
  'https://api.ensideas.com',
]

const FRAME_ANCESTORS = [
  'https://*.gnosis.io',
  'https://*.safe.global',
  'https://nance.app',
  'https://jbdao.org',
]

if (process.env.NODE_ENV === 'development') {
  CONNECT_SRC.push('localhost:*')
}

const FRAME_SRC = [
  'https://verify.walletconnect.com/',
  'https://youtube.com',
  'https://www.youtube.com/',
]

const ContentSecurityPolicy = `
  default-src 'none';
  script-src 'self' ${SCRIPT_SRC.join(' ')};
  style-src 'self' ${STYLE_SRC.join(' ')};
  font-src 'self' data:;
  img-src 'self' ${IMG_SRC.join(' ')} data:;
  connect-src 'self' ${CONNECT_SRC.join(' ')};
  manifest-src 'self';
  frame-src ${FRAME_SRC.join(' ')};
  media-src 'self' https://jbx.mypinata.cloud ${INFURA_IPFS_URLS.join(' ')};
  frame-ancestors ${FRAME_ANCESTORS.join(' ')};
  form-action 'self';
`

const SECURITY_HEADERS = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  }, // NOTE: gnosis safe is still allowed due to frame-ancestors definition
]

/** @type {import('next').NextConfig} */
const nextConfig = removeImports({
  experimental: {
    esmExternals: true,
    swcPlugins: [
      '@lingui/swc-plugin',
      {
        runtimeModules: {
          i18n: ['@lingui/core', 'i18n'],
        },
      },
    ],
  },
  staticPageGenerationTimeout: 90,
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
  i18n: {
    localeDetection: false,
    locales: linguiConfig.locales,
    defaultLocale: linguiConfig.sourceLocale,
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
          ...SECURITY_HEADERS,
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jbm.infura-ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.stamp.fyi',
        port: '',
        pathname: '/avatar/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_INFURA_IPFS_HOSTNAME,
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
})

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
