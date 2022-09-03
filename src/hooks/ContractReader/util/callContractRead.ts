import { Contract } from '@ethersproject/contracts'
import * as Sentry from '@sentry/browser'

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
  readContract: Contract | undefined
  contracts: Record<T, Contract> | undefined
  functionName: string | undefined
  args: unknown[] | null | undefined
}) {
  if (!readContract || !functionName || args === null) return

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
      contracts,
    )

    Sentry.captureException(err, {
      tags: {
        contract: typeof readContract === 'string' ? readContract : undefined,
        contract_function: functionName,
      },
    })
    throw err
  }
}
