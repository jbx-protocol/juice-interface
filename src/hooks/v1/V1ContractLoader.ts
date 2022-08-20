import { Contract } from '@ethersproject/contracts'
import { SignerOrProvider } from 'utils/types'
import { useWallet } from 'hooks/Wallet'

import { V1ContractName } from 'models/v1/contracts'
import { V1Contracts } from 'models/v1/contracts'
import { NetworkName } from 'models/network-name'
import { useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

export function useV1ContractLoader() {
  const [contracts, setContracts] = useState<V1Contracts>()
  const { signer } = useWallet()

  useEffect(() => {
    async function loadContracts() {
      try {
        const network = readNetwork.name

        // Contracts can be used read-only without a signer, but require a signer to create transactions.
        const signerOrProvider = signer ?? readProvider

        const loadContractKeyPair = async (contractName: V1ContractName) => ({
          key: contractName,
          val: await loadContract(contractName, network, signerOrProvider),
        })

        const newContracts = (
          await Promise.all(
            Object.values(V1ContractName).map(loadContractKeyPair),
          )
        ).reduce(
          (acc, { key, val }) => ({
            ...acc,
            [key]: val,
          }),
          {} as V1Contracts,
        )

        setContracts(newContracts)
      } catch (e) {
        console.error('CONTRACT LOADER ERROR:', e)
      }
    }

    loadContracts()
  }, [setContracts, signer])

  return contracts
}

const loadContract = async (
  contractName: keyof typeof V1ContractName,
  network: NetworkName,
  signerOrProvider: SignerOrProvider,
): Promise<Contract> => {
  const contract = await import(
    `@jbx-protocol/contracts-v1/deployments/${network}/${contractName}.json`
  )
  return new Contract(contract.address, contract.abi, signerOrProvider)
}
