import { VeNftVariant } from 'models/veNft'

import { DEFAULT_PINATA_GATEWAY, IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

export const getVeNftBaseImage = (
  baseImagesHash: string,
  variant: VeNftVariant,
  options: {
    useFallback?: boolean
  } = { useFallback: false },
): string => {
  const { useFallback } = options
  const padded = variant.id.toString().padStart(2, '0')
  const gateway = useFallback ? DEFAULT_PINATA_GATEWAY : IPFS_GATEWAY_HOSTNAME
  return `https://${gateway}/ipfs/${baseImagesHash}/characters/${padded}.png`
}
