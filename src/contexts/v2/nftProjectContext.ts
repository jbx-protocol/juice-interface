import { BigNumber } from '@ethersproject/bignumber'
import { VeNftVariant, VeNftToken } from 'models/v2/stakingNFT'
import { createContext } from 'react'

export type VeNftProjectContextType = {
  name: string | undefined
  lockDurationOptions: BigNumber[] | undefined
  baseImagesHash: string | undefined
  resolverAddress: string | undefined
  variants: VeNftVariant[] | undefined
  userTokens: VeNftToken[] | undefined
}

export const VeNftProjectContext = createContext<VeNftProjectContextType>({
  name: undefined,
  lockDurationOptions: undefined,
  baseImagesHash: undefined,
  resolverAddress: undefined,
  variants: undefined,
  userTokens: undefined,
})
