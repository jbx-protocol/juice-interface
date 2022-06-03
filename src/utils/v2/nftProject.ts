import { NFTProjectContextType } from 'contexts/v2/nftProjectContext'
import { StakingNFT } from 'models/v2/stakingNFT'

export const getNFTBaseImage = (
  nftProject: NFTProjectContextType,
  nft: StakingNFT,
): string => {
  const padded = nft.id.toString().padStart(2, '0')
  return `https://gateway.pinata.cloud/ipfs/${nftProject.baseImagesHash}/${padded}.png`
}
