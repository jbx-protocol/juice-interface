/**
 * Checks to see if the app is being served through cloudflare.
 * The cloudflare worker will rewrite the cloudflare meta tag
 * to have a content type of yes.
 * @returns boolean
 */
export const isCloudflare = (): boolean => {
  if (!document) return false
  const els = document.getElementsByName('cloudflare')
  return els[0] && els[0].getAttribute('content') === 'yes'
}
