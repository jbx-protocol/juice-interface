import { Contract } from '@ethersproject/contracts'

type ContractConfig<T> = T | Contract | undefined

export function getContract<T extends string>(
  contractConfig?: ContractConfig<T>,
  contracts?: Record<T, Contract>,
): Contract | undefined {
  if (!contractConfig) return

  if (typeof contractConfig === 'string') {
    return contracts ? contracts[contractConfig] : undefined
  } else return contractConfig
}
