import { V2V3ProjectContracts } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import {
  JBControllerVersion,
  useProjectController,
} from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectController'
import { useProjectFundAccessConstraintsStore } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectFundAccessContraintsStore'
import {
  JBETHPaymentTerminalVersion,
  useProjectPrimaryEthTerminal,
} from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectPrimaryEthTerminal'
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
  versions: {
    JBETHPaymentTerminal: JBETHPaymentTerminalVersion | undefined
    JBControllerVersion: JBControllerVersion | undefined
  }
} {
  const {
    JBController,
    loading: JBControllerLoading,
    version: JBControllerVersion,
  } = useProjectController({
    projectId,
  })

  const {
    JBETHPaymentTerminal,
    loading: JBETHPaymentTerminalLoading,
    version,
  } = useProjectPrimaryEthTerminal({
    projectId,
  })

  const {
    JBETHPaymentTerminalStore,
    loading: JBETHPaymentTerminalStoreLoading,
  } = useProjectPrimaryEthTerminalStore({
    JBETHPaymentTerminal,
  })

  // Introduced in JBController V3.1. Will be undefined for v2v3.0
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
    versions: {
      JBETHPaymentTerminal: version,
      JBControllerVersion,
    },
  }
}
