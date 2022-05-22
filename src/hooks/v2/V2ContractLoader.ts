import { Contract } from '@ethersproject/contracts'

import { NetworkContext } from 'contexts/networkContext'
import { V2Contracts } from 'models/v2/contracts'
import { useContext, useEffect, useState } from 'react'
import {
  getJBController,
  getJBDirectory,
  getJBETHERC20ProjectPayerDeployer,
  getJBETHPaymentTerminal,
  getJBFundingCycleStore,
  getJBOperatorStore,
  getJBPrices,
  getJBProjects,
  getJBSingleTokenPaymentTerminalStore,
  getJBSplitsStore,
  getJBTokenStore,
} from 'juice-sdk'
import { Signer } from '@ethersproject/abstract-signer'

import { readProvider } from 'constants/readProvider'

export function useV2ContractLoader() {
  const [contracts, setContracts] = useState<V2Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    try {
      // Contracts can be used read-only without a signer, but require a signer to create transactions.
      const signerOrProvider =
        (signingProvider?.getSigner() as Signer) ?? readProvider

      const newContracts: V2Contracts = {
        JBController: getJBController(signerOrProvider) as unknown as Contract,
        JBDirectory: getJBDirectory(signerOrProvider) as unknown as Contract,
        JBETHPaymentTerminal: getJBETHPaymentTerminal(
          signerOrProvider,
        ) as unknown as Contract,
        JBFundingCycleStore: getJBFundingCycleStore(
          signerOrProvider,
        ) as unknown as Contract,
        JBOperatorStore: getJBOperatorStore(
          signerOrProvider,
        ) as unknown as Contract,
        JBPrices: getJBPrices(signerOrProvider) as unknown as Contract,
        JBProjects: getJBProjects(signerOrProvider) as unknown as Contract,
        JBSplitsStore: getJBSplitsStore(
          signerOrProvider,
        ) as unknown as Contract,
        JBTokenStore: getJBTokenStore(signerOrProvider) as unknown as Contract,
        JBSingleTokenPaymentTerminalStore: getJBSingleTokenPaymentTerminalStore(
          signerOrProvider,
        ) as unknown as Contract,
        JBETHERC20ProjectPayerDeployer: getJBETHERC20ProjectPayerDeployer(
          signerOrProvider,
        ) as unknown as Contract,
      }

      setContracts(newContracts)
    } catch (e) {
      console.error('CONTRACT LOADER ERROR:', e)
    }
  }, [signingProvider, setContracts])

  return contracts
}
