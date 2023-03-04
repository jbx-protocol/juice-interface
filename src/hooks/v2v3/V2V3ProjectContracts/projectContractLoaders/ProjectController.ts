import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import useProjectControllerAddress from '../../contractReader/ProjectControllerAddress'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export type JBControllerVersion = '3' | '3.0.1' | '3.1'
export const JB_CONTROLLER_V_3: JBControllerVersion = '3'
export const JB_CONTROLLER_V_3_0_1: JBControllerVersion = '3.0.1'
export const JB_CONTROLLER_V_3_1: JBControllerVersion = '3.1'

export function useProjectController({ projectId }: { projectId: number }) {
  const { cv, contracts } = useContext(V2V3ContractsContext)

  const { data: controllerAddress, loading: JBControllerLoading } =
    useProjectControllerAddress({
      projectId,
    })

  const version = isEqualAddress(
    controllerAddress,
    contracts?.JBController?.address,
  )
    ? JB_CONTROLLER_V_3
    : isEqualAddress(controllerAddress, contracts?.JBController3_0_1?.address)
    ? JB_CONTROLLER_V_3_0_1
    : isEqualAddress(controllerAddress, contracts?.JBController3_1?.address)
    ? JB_CONTROLLER_V_3_1
    : undefined

  const JBController = useLoadV2V3Contract({
    cv,
    contractName:
      version === JB_CONTROLLER_V_3
        ? V2V3ContractName.JBController
        : version === JB_CONTROLLER_V_3_0_1
        ? V2V3ContractName.JBController3_0_1
        : version === JB_CONTROLLER_V_3_1
        ? V2V3ContractName.JBController3_1
        : undefined,
    address: controllerAddress,
  })

  return { JBController, loading: JBControllerLoading, version }
}
