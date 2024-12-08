import mainnet from '@jbx-protocol/juice-contracts-v3/deployments/mainnet/JBPrices.json'
import sepolia from '@jbx-protocol/juice-contracts-v3/deployments/sepolia/JBPrices.json'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { Contract } from 'ethers'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'

export async function loadJBPrices(): Promise<Contract | undefined> {
  const contractJson: ContractJson | undefined =
    readNetwork.name === NetworkName.sepolia ? sepolia : mainnet

  if (!contractJson || !contractJson.address || !contractJson.abi)
    return undefined

  return new Contract(contractJson.address, contractJson.abi, readProvider)
}
