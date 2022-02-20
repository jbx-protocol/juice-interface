import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { V2FundingCycleData } from 'models/v2/fundingCycle'
import { createContext } from 'react'

export type V2ProjectContextType = {
  projectId: BigNumber | undefined
  metadata: ProjectMetadataV3 | undefined
  fundingCycle: V2FundingCycleData | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  projectId: undefined,
  metadata: undefined,
  fundingCycle: undefined,
})
