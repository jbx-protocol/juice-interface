export const feedbackFormURL = (
  referrer: 'deploy' | 'stoned-banny',
  projectHandle?: string,
  userAddress?: string,
) => {
  let url = `https://auditor.typeform.com/to/REMUTIbQ#`
  if (projectHandle) {
    url += `project=${projectHandle}&`
  }
  if (userAddress) {
    url += `address=${userAddress}&`
  }
  url += `resolution=${window.innerWidth}x${window.innerHeight}&`
  url += `referrer=${referrer}`
  return url
}
