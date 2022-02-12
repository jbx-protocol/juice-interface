import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { createContext } from 'react'

export type V2ProjectContextType = {
  projectId: BigNumber | undefined
  metadata: ProjectMetadataV3 | undefined
}

export const V2ProjectContext = createContext<V2ProjectContextType>({
  projectId: undefined,
  metadata: undefined,
})
