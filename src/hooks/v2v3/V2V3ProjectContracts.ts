import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContracts } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import useProjectController from './contractReader/ProjectController'
import { useProjectPrimaryEthTerminal } from './contractReader/ProjectPrimaryEthTerminal'
import { useLoadV2V3Contract } from './LoadV2V3Contract'

/**
 * Load project-specific JB contracts.
 */
export function useV2V3ProjectContracts({
  projectId,
}: {
  projectId: number
}): V2V3ProjectContracts {
  const { cv } = useContext(V2V3ContractsContext)

  const { data: controllerAddress } = useProjectController({
    projectId,
  })
  const { data: primaryETHTerminal } = useProjectPrimaryEthTerminal({
    projectId,
  })

  const JBController = useLoadV2V3Contract({
    cv,
    contractName: V2V3ContractName.JBController,
    address: controllerAddress,
  })

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName: V2V3ContractName.JBETHPaymentTerminal,
  })

  return {
    JBController,
    JBETHPaymentTerminal,
  }
}
