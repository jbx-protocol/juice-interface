const withBundleAnalyzer = require('@next/bundle-analyzer')
const linguiConfig = require('./lingui.config')

const webpack = require('webpack')

const removeImports = require('next-remove-imports')({
  test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
  matchImports: '\\.(less|css|scss|sass|styl)$',
})

// Add Web3Modal URLs as WalletConnect is now Web3Modal (Reown)
const WALLET_CONNECT_URLS = [
  'https://*.walletconnect.com',
  'https://*.walletconnect.org',
  'wss://*.walletconnect.org',
  'wss://*.walletconnect.com',
  'https://api.web3modal.org',
  'https://*.web3modal.org',
  'wss://*.web3modal.org',
]

const INFURA_IPFS_URLS = [
  'https://*.infura-ipfs.io',
  'https://ipfs.infura.io:5001',
]

const ETH_SUCKS_URLS = [
  'https://ipfs.banny.eth.sucks',
  'https://ipfs.banny.eth.sucks/*',
]

const V2EX_URLS = [
  'https://cid.v2ex.pro',
  'https://cid.v2ex.pro/*',
]

const SCRIPT_SRC = [
  'https://juicebox.money', // Trusted host
  'https://*.juicebox.money', // Trusted subdomains
  'https://static.hotjar.com', // Hotjar analytics
  'https://script.hotjar.com', // Hotjar analytics
  'https://cdn.usefathom.com', // Fathom analytics
  // Not working as unsafe-eval is required for metamask
  // `'sha256-kZ9E6/oLrki51Yx03/BugStfFrPlm8hjaFbaokympXo='`, // hotjar
  `'unsafe-eval'`, // hotjar
  `'unsafe-inline'`, // MetaMask
  'https://*.getpara.com', // Para API
  'https://*.usecapsule.com', // Para (Formerly Capsule) API
  'https://vercel.live', // Vercel Live feedback
]

const WORKER_SRC = [
  'blob:', // Required for Para/Capsule blob workers
  'https://*.getpara.com', // Para API
  'https://*.usecapsule.com', // Para (Formerly Capsule) API
]

const STYLE_SRC = [
  `'unsafe-inline'`, // NextJS, hotjar
]

const IMG_SRC = [
  'https://*.juicebox.money',
  'https://juicebox.money',
  ...INFURA_IPFS_URLS,
  ...ETH_SUCKS_URLS,
  ...V2EX_URLS,
  'https://jbx.mypinata.cloud',
  'https://gateway.pinata.cloud',
  'https://gray-main-toad-36.mypinata.cloud',
  'https://cdn.stamp.fyi',
  'https://ipfs.io',
  'https://cdn.discordapp.com',
  'https://cdn.usefathom.com',
  '*.walletconnect.com',
]

const CONNECT_SRC = [
  'https://subgraph.satsuma-prod.com',
  'https://testnets.graph-eu.p2pify.com',
  'https://ethereum-mainnet.graph-eu.p2pify.com',
  'https://*.juicebox.money',
  'https://juicebox.money',
  'https://*.infura.io',
  ...INFURA_IPFS_URLS,
  ...ETH_SUCKS_URLS,
  ...V2EX_URLS,
  'https://api.pinata.cloud',
  'https://jbx.mypinata.cloud',
  'https://gray-main-toad-36.mypinata.cloud',
  'https://api.studio.thegraph.com',
  'https://gateway.thegraph.com',
  'https://api.tenderly.co',
  'https://*.hotjar.com',
  'https://*.hotjar.io',
  'wss://*.hotjar.com',
  'https://*.safe.global',
  'https://*.snapshot.org',
  'https://*.wallet.coinbase.com',
  'https://api.blocknative.com', // used for tx gas estimation across chains
  'wss://www.walletlink.org/rpc', // Coinbase
  ...WALLET_CONNECT_URLS,
  'https://*.supabase.co',
  'https://api.ensideas.com',
  'https://cloudflare-eth.com',
  'https://rpc.sepolia.org/',
  'https://sepolia-rollup.arbitrum.io/rpc',
  'https://sepolia.optimism.io',
  'https://relayr-api-staging.up.railway.app',
  'https://api.relayr.ba5ed.com',
  'https://bendystraw.xyz',
  'https://bendystraw.xyz/*',
  'https://testnet.bendystraw.xyz',
  'https://testnet.bendystraw.xyz/*',
  'https://*.getpara.com', // Para API
  'https://*.usecapsule.com', // Para (Formerly Capsule) API
  'wss://*.getpara.com',
  'wss://*.usecapsule.com',
  'https://*.sentry.io', // Sentry error tracking
  'https://*.ingest.sentry.io', // Sentry error tracking for Para
  'https://*.ingest.us.sentry.io', // Sentry US region
  'https://ipfs.io',
]

const FRAME_ANCESTORS = [
  'https://*.gnosis.io',
  'https://*.safe.global',
  'https://nance.app',
  'https://jbdao.org',
  'https://nounspace.com',
  'https://*.nounspace.com',
]

if (process.env.NODE_ENV === 'development') {
  CONNECT_SRC.push('localhost:*')
}

const FRAME_SRC = [
  'https://verify.walletconnect.com/',
  'https://youtube.com',
  'https://www.youtube.com/',
  'https://*.getpara.com', // Para API
  'https://*.usecapsule.com', // Para (Formerly Capsule) API
  'https://vercel.live', // Vercel Live feedback
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
  media-src 'self' https://jbx.mypinata.cloud ${INFURA_IPFS_URLS.join(' ')} ${ETH_SUCKS_URLS.join(' ')} ${V2EX_URLS.join(' ')};
  frame-ancestors ${FRAME_ANCESTORS.join(' ')};
  form-action 'self';
  worker-src 'self' ${WORKER_SRC.join(' ')};
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
  modularizeImports: {
    '@heroicons/react/20/solid': {
      transform: '@heroicons/react/20/solid/{{member}}',
    },
    '@heroicons/react/20/outline': {
      transform: '@heroicons/react/20/outline/{{member}}',
    },
    '@heroicons/react/24/solid': {
      transform: '@heroicons/react/24/solid/{{member}}',
    },
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
    antd: {
      transform: 'antd/es/{{member}}',
    },
    '@headlessui/react': {
      transform: '@headlessui/react/{{member}}',
    },
  },
  experimental: {
    esmExternals: true,
    optimizePackageImports: [
      // TODO: For whatever reason, doesnt work on current version of next (^14.2.10)
      // TODO: once on a later version, replace the modularizeImports with this
      // '@heroicons/react/20/solid',
      // '@heroicons/react/20/outline',
      // '@heroicons/react/24/solid',
      // '@heroicons/react/24/outline',
      // 'lodash',
      // 'antd',
      // '@headlessui/react',
    ],
  },
  staticPageGenerationTimeout: 90,
  transpilePackages: [
    '@getpara/ethers-v5-integration',
    '@ant-design/icons',
    '@ant-design/icons-svg',
    '@ant-design/react-slick',
    '@ant-design/colors',
    'rc-align',
    'rc-cascader',
    'rc-collapse',
    'rc-dialog',
    'rc-drawer',
    'rc-dropdown',
    'rc-field-form',
    'rc-image',
    'rc-input',
    'rc-input-number',
    'rc-mentions',
    'rc-menu',
    'rc-motion',
    'rc-notification',
    'rc-overflow',
    'rc-pagination',
    'rc-picker',
    'rc-progress',
    'rc-rate',
    'rc-resize-observer',
    'rc-segmented',
    'rc-select',
    'rc-slider',
    'rc-steps',
    'rc-table',
    'rc-tabs',
    'rc-textarea',
    'rc-tooltip',
    'rc-tree',
    'rc-tree-select',
    'rc-trigger',
    'rc-upload',
    'rc-util',
    'rc-virtual-list',
  ],
  webpack: config => {
    config.resolve.fallback = { fs: false, module: false }
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
      }),
    )
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    })

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
      {
        source: '/(.*)',
        headers: [
          {
            key: 'x-vercel-country',
            value: '', // Allow this header to pass through
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Vercel-IP-Country-Region',
            value: '', // Allow this header to pass through
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Vercel-IP-City',
            value: '', // Allow this header to pass through
          },
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
        hostname: process.env.NEXT_PUBLIC_INFURA_IPFS_HOSTNAME || 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.banny.eth.sucks',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'cid.v2ex.pro',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
})

module.exports = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig)
