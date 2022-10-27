import { CV2V3 } from 'models/cv'
import { V2V3Contracts } from 'models/v2v3/contracts'
import { createContext } from 'react'

export const V2V3ContractsContext: React.Context<{
  contracts?: V2V3Contracts
  cv?: CV2V3
  cvs?: CV2V3[]
  setCv?: (version: CV2V3) => void
  setCvs?: (cvs: CV2V3[]) => void
}> = createContext({})
