import { VeNftVariant } from 'models/veNft'

import {
  OPEN_IPFS_GATEWAY_HOSTNAME,
  RESTRICTED_IPFS_GATEWAY_HOSTNAME,
} from 'constants/ipfs'

export const getVeNftBaseImage = (
  baseImagesHash: string,
  variant: VeNftVariant,
  options: {
    useFallback?: boolean
  } = { useFallback: false },
): string => {
  const { useFallback } = options
  const padded = variant.id.toString().padStart(2, '0')
  const gateway = useFallback
    ? OPEN_IPFS_GATEWAY_HOSTNAME
    : RESTRICTED_IPFS_GATEWAY_HOSTNAME
  return `https://${gateway}/ipfs/${baseImagesHash}/characters/${padded}.png`
}
