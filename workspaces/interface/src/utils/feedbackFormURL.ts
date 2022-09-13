// Builds URL to feedbackForm given parametres
export const feedbackFormURL = ({
  referrer,
  projectHandle,
  userAddress,
}: {
  referrer: 'deploy' | 'stoned-banny'
  projectHandle?: string
  userAddress?: string
}) => {
  const url = new URL(`https://auditor.typeform.com/to/REMUTIbQ#`)
  const resWidth = window ? window.innerWidth : 0
  const resHeight = window ? window.innerHeight : 0
  if (projectHandle) {
    url.searchParams.set('project', projectHandle)
  }
  if (userAddress) {
    url.searchParams.set('address', userAddress)
  }
  url.searchParams.set('resolution', `${resWidth}x${resHeight}`)
  url.searchParams.set('referrer', referrer)

  return url.toString()
}
