import { VeNftVariant } from 'models/veNft'
import { ipfsGatewayUrl } from './ipfs'

export const getVeNftBaseImage = (
  baseImagesHash: string,
  variant: VeNftVariant,
): string => {
  const padded = variant.id.toString().padStart(2, '0')

  return ipfsGatewayUrl(`${baseImagesHash}/characters/${padded}.png`)
}
