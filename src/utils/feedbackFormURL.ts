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
  if (projectHandle) {
    url.searchParams.set('project', projectHandle)
  }
  if (userAddress) {
    url.searchParams.set('address', userAddress)
  }
  url.searchParams.set(
    'resolution',
    `${window.innerWidth}x${window.innerHeight}`,
  )
  url.searchParams.set('referrer', referrer)

  return url.toString()
}
