export const withoutHttps = (url: string) => url.replace(/^https?:\/\//, '')

export const withHttps = (url: string) =>
  url.startsWith('http') ? url : `https://${url}`
