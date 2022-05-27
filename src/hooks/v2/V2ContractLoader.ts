import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'
import { V2ContractName, V2Contracts } from 'models/v2/contracts'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

/**
 *  Defines the ABI filename to use for a given V2ContractName.
 */
const CONTRACT_ABI_OVERRIDES: { [k in V2ContractName]?: string } = {
  JBController: 'JBController_2',
  JBDirectory: 'JBDirectory_2',
  JBETHPaymentTerminal: 'JBETHPaymentTerminal_2',
  JBSplitsStore: 'JBSplitsStore_2',
  JBTokenStore: 'JBTokenStore_2',
  JBSingleTokenPaymentTerminalStore: 'JBSingleTokenPaymentTerminalStore_2',
  JBFundingCycleStore: 'JBFundingCycleStore_2',

  DeprecatedJBController: 'JBController',
  DeprecatedJBSplitsStore: 'JBSplitsStore',
  DeprecatedJBDirectory: 'JBDirectory',
}

export function useV2ContractLoader() {
  const [contracts, setContracts] = useState<V2Contracts>()

  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signingProvider?.getSigner() ?? readProvider

        const newContracts = Object.values(V2ContractName).reduce(
          (accumulator, contractName) => ({
            ...accumulator,
            [contractName]: loadContract(
              contractName,
              network,
              signerOrProvider,
            ),
          }),
          {} as V2Contracts,
        )

        setContracts(newContracts)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}

const loadContract = (
  contractName: V2ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Contract | undefined => {
  const resolvedContractName =
    CONTRACT_ABI_OVERRIDES[contractName] ?? contractName

  const contract = require(`@jbx-protocol/contracts-v2/deployments/${network}/${resolvedContractName}.json`)
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
