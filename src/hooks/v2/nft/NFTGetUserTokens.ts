import { BigNumber } from '@ethersproject/bignumber'
import {
  VeNftVariant,
  VeNftLockInfo,
  VeNftToken,
  VeNftMetadata,
} from 'models/v2/stakingNFT'

export function useNFTGetUserTokens(userAddress?: string) {
  if (!userAddress) {
    return []
  }

  const lockInfo: VeNftLockInfo = {
    amount: BigNumber.from(10),
    end: 1658361600,
    duration: 4320000,
    useJbToken: true,
    allowPublicExtension: false,
  }

  const variant: VeNftVariant = {
    id: 1,
    name: 'Nammu',
    tokensStakedMin: 1,
    tokensStakedMax: 99,
  }

  const metadata: VeNftMetadata = {
    name: 'Nammu 50 Days',
    description: 'Nammu 50 Days',
    minter: userAddress,
    image:
      'https://gateway.pinata.cloud/ipfs/bafybeibegsk5otvi3dfkyxib7gopwv4hlsoxohhzodqo24gjhmyaapdrlu/002.png',
    thumbnailUri:
      'https://gateway.pinata.cloud/ipfs/bafybeibegsk5otvi3dfkyxib7gopwv4hlsoxohhzodqo24gjhmyaapdrlu/002s.png',
    animation_url:
      'https://gateway.pinata.cloud/ipfs/bafybeidmloxqpwm2f2sqnigoo2dtycjzctxy4phirybvwjtn3uwdm5pi3i/2.html',
  }

  const nfts: VeNftToken[] = [
    {
      tokenId: 1,
      ownerAddress: userAddress,
      lockInfo,
      variant,
      metadata,
    },
  ]

  return nfts
}
