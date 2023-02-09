import { V2V3ProjectContracts } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { useProjectController } from './projectContractLoaders/ProjectController'
import { useProjectPrimaryEthTerminal } from './projectContractLoaders/ProjectPrimaryEthTerminal'

/**
 * Load project-specific JB contracts.
 */
export function useV2V3ProjectContracts({ projectId }: { projectId: number }): {
  data: V2V3ProjectContracts
  loading: {
    JBControllerLoading: boolean
    JBETHPaymentTerminalLoading: boolean
  }
} {
  const { JBController, loading: JBControllerLoading } = useProjectController({
    projectId,
  })

  const { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading } =
    useProjectPrimaryEthTerminal({
      projectId,
    })

  return {
    data: {
      JBController,
      JBETHPaymentTerminal,
    },
    loading: {
      JBControllerLoading,
      JBETHPaymentTerminalLoading,
    },
  }
}
