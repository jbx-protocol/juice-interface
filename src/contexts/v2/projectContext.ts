import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { createContext } from 'react'

export type V2ProjectContextType = {
  projectId: BigNumber | undefined
  projectMetadata: ProjectMetadataV3 | undefined
  fundingCycle: V2FundingCycle | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  projectId: undefined,
  projectMetadata: undefined,
  fundingCycle: undefined,
})
