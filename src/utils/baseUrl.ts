export const getBaseUrl = () => {
  if (!process.env.NEXT_PUBLIC_BASE_URL) return undefined
  try {
    return new URL(process.env.NEXT_PUBLIC_BASE_URL)
  } catch (error) {
    console.error('getBaseUrl', error)
    return undefined
  }
}

export const getBaseUrlOrigin = () => {
  const baseUrl = getBaseUrl()
  if (!baseUrl) return undefined
  return baseUrl.origin.replace(/:\d+$/, '')
}
