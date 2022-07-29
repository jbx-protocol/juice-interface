import { BigNumber } from '@ethersproject/bignumber'
import { VeNftToken } from 'models/subgraph-entities/v2/venft-token'
import { VeNftVariant } from 'models/v2/veNft'
import { createContext } from 'react'

export type VeNftContextType = {
  name: string | undefined
  lockDurationOptions: BigNumber[] | undefined
  baseImagesHash: string | undefined
  resolverAddress: string | undefined
  variants: VeNftVariant[] | undefined
  userTokens: VeNftToken[] | undefined
}

export const VeNftContext = createContext<VeNftContextType>({
  name: undefined,
  lockDurationOptions: undefined,
  baseImagesHash: undefined,
  resolverAddress: undefined,
  variants: undefined,
  userTokens: undefined,
})
