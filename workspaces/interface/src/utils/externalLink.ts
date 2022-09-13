// Adds 'https://' to the start of a link if it doesn't already have it
export function withHttps(link: string | undefined) {
  if (!link) return
  if (link?.slice(0, 8) !== 'https://' && link?.slice(0, 7) !== 'http://') {
    return `https://${link}`
  }
  return link
}
