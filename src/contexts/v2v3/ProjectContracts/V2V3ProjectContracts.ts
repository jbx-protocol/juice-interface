import { V2V3ProjectContracts } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useProjectController } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectController'
import { useProjectFundAccessConstraintsStore } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectFundAccessContraintsStore'
import { useProjectPrimaryEthTerminal } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectPrimaryEthTerminal'
import { useProjectPrimaryEthTerminalStore } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectPrimaryEthTerminalStore'

/**
 * Load project-specific JB contracts.
 */
export function useV2V3ProjectContracts({ projectId }: { projectId: number }): {
  data: V2V3ProjectContracts
  loading: {
    JBControllerLoading: boolean
    JBETHPaymentTerminalLoading: boolean
    JBETHPaymentTerminalStoreLoading: boolean
    JBFundAccessConstraintsStoreLoading: boolean
  }
} {
  const { JBController, loading: JBControllerLoading } = useProjectController({
    projectId,
  })

  const { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading } =
    useProjectPrimaryEthTerminal({
      projectId,
    })

  const {
    JBETHPaymentTerminalStore,
    loading: JBETHPaymentTerminalStoreLoading,
  } = useProjectPrimaryEthTerminalStore({
    JBETHPaymentTerminal,
  })

  const {
    JBFundAccessConstraintsStore,
    loading: JBFundAccessConstraintsStoreLoading,
  } = useProjectFundAccessConstraintsStore({ JBController })

  return {
    data: {
      JBController,
      JBETHPaymentTerminal,
      JBETHPaymentTerminalStore,
      JBFundAccessConstraintsStore,
    },
    loading: {
      JBControllerLoading,
      JBETHPaymentTerminalLoading,
      JBETHPaymentTerminalStoreLoading,
      JBFundAccessConstraintsStoreLoading,
    },
  }
}
