module.exports = {
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, module: false }

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
