import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'

import { NetworkContext } from 'contexts/networkContext'

import { NetworkName } from 'models/network-name'

import { V2ContractName, V2Contracts } from 'models/v2/contracts'

import { useContext, useEffect, useState } from 'react'

import { mainnetPublicResolver } from 'constants/contracts/mainnet/PublicResolver'
import { rinkebyPublicResolver } from 'constants/contracts/rinkeby/PublicResolver'
import { NETWORKS_BY_NAME, readNetwork } from 'constants/networks'
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
    contractJson = {
      abi: (
        await import(
          `@jbx-protocol/project-handles/out/JBProjectHandles.sol/JBProjectHandles.json`
        )
      ).abi,
      address: (
        (await import(
          `@jbx-protocol/project-handles/broadcast/Deploy.sol/${NETWORKS_BY_NAME[network].chainId}/run-latest.json`
        )) as { receipts: { contractAddress: string }[] }
      ).receipts[0].contractAddress, // contractAddress is prefixed `0x0x` in error, trim first `0x`
    }
  } else if (contractName === V2ContractName.PublicResolver) {
    // ENS contracts package currently doesn't include rinkeby information, and ABI contains errors
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
    throw new Error(
      `Error importing contract ${contractName}. Network: ${network})`,
    )
  }

  return new Contract(contractJson.address, contractJson.abi, signerOrProvider)
}
