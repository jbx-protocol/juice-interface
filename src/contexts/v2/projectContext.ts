import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { Split } from 'models/v2/splits'
import { createContext } from 'react'

export type V2ProjectContextType = {
  projectId: BigNumber | undefined
  projectMetadata: ProjectMetadataV4 | undefined
  fundingCycle: V2FundingCycle | undefined
  payoutSplits: Split[] | undefined
  reserveTokenSplits: Split[] | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  projectId: undefined,
  projectMetadata: undefined,
  fundingCycle: undefined,
  payoutSplits: undefined,
  reserveTokenSplits: undefined,
})
