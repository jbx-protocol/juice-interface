import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { StakingNFT, VeNftCharacter } from 'models/v2/stakingNFT'
import { createContext } from 'react'

export type VeNftProjectContextType = {
  name: string | undefined
  lockDurationOptions: BigNumberish[] | undefined
  baseImagesHash: string | undefined
  resolverAddress: string | undefined
  characters: VeNftCharacter[] | undefined
}

export const veNftProjectContext = createContext<VeNftProjectContextType>({
  name: undefined,
  lockDurationOptions: undefined,
  baseImagesHash: undefined,
  resolverAddress: undefined,
  characters: undefined,
})

// Old

export type NFTProjectContextType = {
  lockDurationOptions: BigNumber[] | undefined
  baseImagesHash: string | undefined
  resolverAddress: string | undefined
  nfts: StakingNFT[] | undefined
  userNFTs: StakingNFT[] | undefined
}

export const NFTProjectContext = createContext<NFTProjectContextType>({
  lockDurationOptions: undefined,
  baseImagesHash: undefined,
  resolverAddress: undefined,
  nfts: undefined,
  userNFTs: undefined,
})
