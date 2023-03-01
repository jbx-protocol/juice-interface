import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'

export function useIsJBControllerV3_0_1({
  controllerAddress,
}: {
  controllerAddress: string | undefined
}): boolean {
  const { contracts } = useContext(V2V3ContractsContext)
  return isEqualAddress(
    controllerAddress,
    contracts?.JBController3_0_1?.address,
  )
}
