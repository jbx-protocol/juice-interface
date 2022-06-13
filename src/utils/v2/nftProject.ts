import { VeNftVariant } from 'models/veNft/veNftVariant'

export const getNFTBaseImage = (
  baseImagesHash: string,
  variant: VeNftVariant,
): string => {
  const padded = variant.id.toString().padStart(2, '0')
  return `https://gateway.pinata.cloud/ipfs/${baseImagesHash}/${padded}.png`
}
