import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { Contract } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { NetworkName } from 'models/networkName'
import { SignerOrProvider } from 'models/signerOrProvider'
import { V1ContractName, V1Contracts } from 'models/v1/contracts'
import { useEffect, useState } from 'react'

const loadV1Contract = async (
  contractName: V1ContractName,
  network: NetworkName,
  signerOrProvider: SignerOrProvider,
): Promise<Contract | undefined> => {
  let contract: Contract | undefined

  if (network === NetworkName.goerli || network === NetworkName.sepolia) return

  switch (contractName) {
    case V1ContractName.FundingCycles:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/FundingCycles.json`
      )
      break
    case V1ContractName.TerminalV1:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/TerminalV1.json`
      )
      break
    case V1ContractName.TerminalV1_1:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/TerminalV1_1.json`
      )
      break
    case V1ContractName.TerminalDirectory:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/TerminalDirectory.json`
      )
      break
    case V1ContractName.ModStore:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/ModStore.json`
      )
      break
    case V1ContractName.OperatorStore:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/OperatorStore.json`
      )
      break
    case V1ContractName.Projects:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/Projects.json`
      )
      break
    case V1ContractName.TicketBooth:
      contract = await import(
        `@jbx-protocol/contracts-v1/deployments/${network}/TicketBooth.json`
      )
      break
  }

  if (!contract) return

  return new Contract(contract.address, contract.abi, signerOrProvider)
}

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
          val: await loadV1Contract(contractName, network, signerOrProvider),
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
