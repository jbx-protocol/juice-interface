import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import {
  ControllerVersion,
  SUPPORTED_CONTROLLERS,
  V2V3ContractName,
  V2V3Contracts,
} from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import useProjectControllerAddress from '../../contractReader/useProjectControllerAddress'
import { useLoadV2V3Contract } from '../../useLoadV2V3Contract'

export function useProjectController({ projectId }: { projectId: number }) {
  const { cv, contracts } = useContext(V2V3ContractsContext)

  const { data: controllerAddress, loading: JBControllerLoading } =
    useProjectControllerAddress({
      projectId,
    })

  const contractName = getControllerName(controllerAddress, contracts)

  const JBController = useLoadV2V3Contract({
    cv,
    contractName,
    address: controllerAddress,
  })

  return { JBController, loading: JBControllerLoading, version: contractName }
}

const getControllerName = (
  address: string | undefined,
  contracts: V2V3Contracts | undefined,
): ControllerVersion | undefined => {
  if (!address || !contracts) return undefined

  const terminalName = SUPPORTED_CONTROLLERS.find(contractName => {
    return isEqualAddress(
      address,
      contracts[contractName as V2V3ContractName]?.address,
    )
  })

  return terminalName
}
