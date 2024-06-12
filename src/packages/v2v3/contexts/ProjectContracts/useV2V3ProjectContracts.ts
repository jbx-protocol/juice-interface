import { V2V3ProjectContracts } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useProjectController } from 'packages/v2v3/hooks/V2V3ProjectContracts/projectContractLoaders/useProjectController'
import { useProjectFundAccessConstraintsStore } from 'packages/v2v3/hooks/V2V3ProjectContracts/projectContractLoaders/useProjectFundAccessContraintsStore'
import { useProjectPrimaryEthTerminal } from 'packages/v2v3/hooks/V2V3ProjectContracts/projectContractLoaders/useProjectPrimaryEthTerminal'
import { useProjectPrimaryEthTerminalStore } from 'packages/v2v3/hooks/V2V3ProjectContracts/projectContractLoaders/useProjectPrimaryEthTerminalStore'
import {
  ControllerVersion,
  PaymentTerminalVersion,
} from 'packages/v2v3/models/contracts'

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
    JBETHPaymentTerminalVersion: PaymentTerminalVersion | undefined
    JBControllerVersion: ControllerVersion | undefined
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
