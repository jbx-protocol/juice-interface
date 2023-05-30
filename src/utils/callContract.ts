import { Contract } from 'ethers'
import { ContractConfig } from 'hooks/ContractReader/types'
import { callContractRead, getContract } from 'hooks/ContractReader/util'

export const callContract = async <C extends string>({
  contract,
  contracts,
  functionName,
  args,
}: {
  contract: ContractConfig<C> | undefined
  contracts: Record<C, Contract> | undefined
  functionName: string
  args: unknown[] | null
}) => {
  const readContract = getContract(contract, contracts)
  if (!readContract || !functionName || args === null) return
  const result = await callContractRead({
    readContract,
    functionName,
    args,
  })
  return result
}
