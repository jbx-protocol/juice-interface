export function tweet(message: string) {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    message,
  )}`

  window.open(twitterUrl, '_blank')
}
