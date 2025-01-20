import { Contract } from 'ethers'

/**
 * Calls the `readContract` to be read from `contracts` in `functionName`.
 *
 * This is done in pureJS.
 */
export async function callContractRead<T extends string>({
  readContract,
  contracts,
  functionName,
  args,
}: {
  readContract: Contract
  functionName: string
  args: unknown[] | null | undefined
  contracts?: Record<T, Contract> | undefined
}) {
  try {
    console.info(`📚 Read >`, functionName, { contract: readContract, args })
    return await readContract[functionName](...(args ?? []))
  } catch (error) {
    console.error(`📕 Read error >`, functionName, error, {
      args,
      contract: readContract.address,
      contracts,
    })

    throw error
  }
}
