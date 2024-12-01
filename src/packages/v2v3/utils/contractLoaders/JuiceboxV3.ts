import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'

export const loadJuiceboxV3Contract = async (
  contractName: V2V3ContractName,
  network: NetworkName,
): Promise<ContractJson | undefined> => {
  const contractSet =
    network === 'sepolia'
      ? await import('./contracts/juice-contracts-v3-sepolia')
      : await import('./contracts/juice-contracts-v3-mainnet')

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (contractSet as any)[contractName] as ContractJson
  } catch {
    return undefined
  }
}
