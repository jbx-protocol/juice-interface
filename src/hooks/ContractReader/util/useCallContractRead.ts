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
    console.info(`📚 Read >`, functionName)
    return await readContract[functionName](...(args ?? []))
  } catch (err) {
    console.error(
      `📕 Read error >`,
      functionName,
      { args },
      { err },
      { contract: readContract.address },
      { contracts },
    )

    throw err
  }
}
