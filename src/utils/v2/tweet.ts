import { windowOpen } from 'utils/windowUtils'

export function tweet(message: string) {
  if (typeof window === 'undefined') return
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    message,
  )}`

  windowOpen(twitterUrl)
}
