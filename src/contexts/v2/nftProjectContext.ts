import { BigNumber } from '@ethersproject/bignumber'
import { StakingNFT } from 'models/v2/stakingNFT'
import { createContext } from 'react'

export type NFTProjectContextType = {
  lockDurationOptions: BigNumber[] | undefined
  baseImagesHash: string | undefined
  resolverAddress: string | undefined
  nfts: StakingNFT[] | undefined
}

export const NFTProjectContext = createContext<NFTProjectContextType>({
  lockDurationOptions: undefined,
  baseImagesHash: undefined,
  resolverAddress: undefined,
  nfts: undefined,
})

export type OwnedNFTContextType = {
  ownedNFTs: StakingNFT[] | undefined
}
