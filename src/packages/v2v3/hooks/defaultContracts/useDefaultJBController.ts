import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

/**
 * Return the controller address that should be used to launch projects, funding cycles, etc.
 */
export function useDefaultJBController() {
  const { contracts } = useContext(V2V3ContractsContext)

  return contracts?.JBController3_1
}
