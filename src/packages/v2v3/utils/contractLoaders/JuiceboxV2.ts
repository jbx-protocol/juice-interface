import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import * as mainnet from './contracts/juice-contracts-v2-mainnet'
import * as sepolia from './contracts/juice-contracts-v2-sepolia'
export const loadJuiceboxV2Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson | undefined> => {
  const contractSet = network === 'sepolia' ? sepolia : mainnet

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (contractSet as any)[contractName] as ContractJson
  } catch {
    return undefined
  }
}
