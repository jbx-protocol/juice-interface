import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'

import { NetworkName } from 'models/network-name'

import { V2ContractName, V2Contracts } from 'models/v2/contracts'

import { useContext, useEffect, useState } from 'react'

import { mainnetJbProjectHandles } from 'constants/contracts/mainnet/JBProjectHandles'
import { mainnetPublicResolver } from 'constants/contracts/mainnet/PublicResolver'
import { rinkebyJbProjectHandles } from 'constants/contracts/rinkeby/JBProjectHandles'
import { rinkebyPublicResolver } from 'constants/contracts/rinkeby/PublicResolver'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'

/**
 *  Defines the ABI filename to use for a given V2ContractName.
 */
const CONTRACT_ABI_OVERRIDES: {
  [k in V2ContractName]?: { filename: string; version: string }
} = {
  DeprecatedJBController: {
    version: '4.0.0',
    filename: 'JBController',
  },
  DeprecatedJBSplitsStore: {
    version: '4.0.0',
    filename: 'JBSplitsStore',
  },
  DeprecatedJBDirectory: {
    version: '4.0.0',
    filename: 'JBDirectory',
  },
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

        const contractLoaders = await Promise.all(
          Object.values(V2ContractName).map(contractName =>
            loadContract(contractName, network, signerOrProvider),
          ),
        )

        const newContractMap = Object.values(V2ContractName).reduce(
          (accumulator, contractName, idx) => ({
            ...accumulator,
            [contractName]: contractLoaders[idx],
          }),
          {} as V2Contracts,
        )

        setContracts(newContractMap)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [signingProvider, setContracts])

  return contracts
}

const loadContract = async (
  contractName: V2ContractName,
  network: NetworkName,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
): Promise<Contract | undefined> => {
  let contractJson: { abi: object[]; address: string } | undefined = undefined

  if (contractName === V2ContractName.JBProjectHandles) {
    // TODO import JBProjectHandles package
    if (network === NetworkName.mainnet) contractJson = mainnetJbProjectHandles
    if (network === NetworkName.rinkeby) contractJson = rinkebyJbProjectHandles
  } else if (contractName === V2ContractName.PublicResolver) {
    // TODO how to avoid setting contract objects as constants
    if (network === NetworkName.mainnet) contractJson = mainnetPublicResolver
    if (network === NetworkName.rinkeby) contractJson = rinkebyPublicResolver
  } else {
    const contractOverride = CONTRACT_ABI_OVERRIDES[contractName]
    const version = contractOverride?.version ?? 'latest'
    const filename = contractOverride?.filename ?? contractName
    contractJson = await import(
      `@jbx-protocol/contracts-v2-${version}/deployments/${network}/${filename}.json`
    )
  }

  if (!contractJson) {
    throw new Error(`Error importing contract ${contractName} on ${network}`)
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
