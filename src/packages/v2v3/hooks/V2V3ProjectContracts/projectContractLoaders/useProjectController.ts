import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import {
  ControllerVersion,
  SUPPORTED_CONTROLLERS,
  V2V3ContractName,
  V2V3Contracts,
} from 'packages/v2v3/models/contracts'
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
      // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
      contracts[contractName as V2V3ContractName]?.target as string,
    )
  })

  return terminalName
}
