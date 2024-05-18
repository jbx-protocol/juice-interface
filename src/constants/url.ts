export const SiteBaseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/`
  : undefined

// Fixes File '/Users/wraeth/projects/juice-interface/src/constants/url.ts' is not a module.
export {}
