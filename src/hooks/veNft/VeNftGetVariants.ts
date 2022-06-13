import { VeNftVariant } from 'models/veNft/veNftVariant'

export function useNFTGetVariants() {
  const variant: VeNftVariant = {
    id: 1,
    name: 'Nammu',
    tokensStakedMin: 1,
  }

  const variant2: VeNftVariant = {
    id: 2,
    name: 'Farceur',
    tokensStakedMin: 100,
    tokensStakedMax: 199,
  }

  return [variant, variant2]
}
