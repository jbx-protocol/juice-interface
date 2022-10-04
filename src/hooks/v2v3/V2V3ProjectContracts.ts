import { Contract } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContracts } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext, useEffect, useState } from 'react'
import { loadJuiceboxV2OrV3Contract } from 'utils/v2v3/contractLoaders/JuiceboxV2OrV3'
import useProjectController from './contractReader/ProjectController'
import { useProjectPrimaryEthTerminal } from './contractReader/ProjectPrimaryEthTerminal'

/**
 * Load project-specific JB contracts.
 */
export function useV2V3ProjectContracts({
  projectId,
}: {
  projectId: number
}): V2V3ProjectContracts {
  const { cv } = useContext(V2V3ContractsContext)
  const [contracts, setContracts] = useState<{
    JBController?: Contract
    JBETHPaymentTerminal?: Contract
  }>({})

  /**
   * Load controller data
   */
  const { data: controllerAddress } = useProjectController({
    projectId,
  })
  const { data: primaryETHTerminal } = useProjectPrimaryEthTerminal({
    projectId,
  })

  // TODO make more efficient
  useEffect(() => {
    async function loadContracts() {
      if (!cv) return

      const JBControllerJson = await loadJuiceboxV2OrV3Contract(
        cv,
        V2V3ContractName.JBController,
        readNetwork.name,
      )
      const JBController =
        controllerAddress && JBControllerJson
          ? new Contract(controllerAddress, JBControllerJson.abi, readProvider)
          : undefined

      const JBETHPaymentTerminalJson = await loadJuiceboxV2OrV3Contract(
        cv,
        V2V3ContractName.JBETHPaymentTerminal,
        readNetwork.name,
      )

      const JBETHPaymentTerminal = primaryETHTerminal
        ? new Contract(
            primaryETHTerminal,
            JBETHPaymentTerminalJson.abi,
            readProvider,
          )
        : undefined

      setContracts({ JBController, JBETHPaymentTerminal })
    }

    loadContracts()
  }, [controllerAddress, cv, primaryETHTerminal])

  return contracts
}
