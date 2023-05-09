import { V2V3ProjectContracts } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import {
  JBControllerVersion,
  useProjectController,
} from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectController'
import { useProjectFundAccessConstraintsStore } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectFundAccessContraintsStore'
import {
  JBETHPaymentTerminalVersion,
  useProjectPrimaryEthTerminal,
} from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectPrimaryEthTerminal'
import { useProjectPrimaryEthTerminalStore } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/useProjectPrimaryEthTerminalStore'

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
    JBETHPaymentTerminalVersion: JBETHPaymentTerminalVersion | undefined
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
    version: JBETHPaymentTerminalVersion,
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
      JBETHPaymentTerminalVersion,
      JBControllerVersion,
    },
  }
}
