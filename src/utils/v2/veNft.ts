import { VeNftVariant } from 'models/v2/veNftVariant'

export const getNFTBaseImage = (
  baseImagesHash: string,
  variant: VeNftVariant,
): string => {
  const padded = variant.id.toString().padStart(2, '0')
  return `https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_HOSTNAME}/ipfs/${baseImagesHash}/${padded}.png`
}
