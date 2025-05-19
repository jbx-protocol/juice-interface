export const bendystrawUri = () => {
  const mainnetUrl = process.env.NEXT_PUBLIC_BENDYSTRAW_URL as string
  const testnetUrl = process.env.NEXT_PUBLIC_BENDYSTRAW_TESTNET_URL as string

  const uri =
    process.env.NEXT_PUBLIC_TESTNET === 'true' ? testnetUrl : mainnetUrl

  const url = new URL(uri)

  return url.href
}