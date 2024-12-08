import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { Contract } from 'ethers'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'

export async function loadJBPrices(): Promise<Contract | undefined> {
  let contractJson: ContractJson | undefined

  if (readNetwork.name === NetworkName.sepolia) {
    contractJson = await import(
      '@jbx-protocol/juice-contracts-v3/deployments/sepolia/JBPrices.json'
    )
  } else {
    contractJson = await import(
      '@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBPrices.json'
    )
  }

  if (!contractJson || !contractJson.address || !contractJson.abi)
    return undefined

  return new Contract(contractJson.address, contractJson.abi, readProvider)
}
