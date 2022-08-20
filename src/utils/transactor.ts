import { onCatch, Transactor, TransactorOptions } from 'hooks/Transactor'
import { Contract } from '@ethersproject/contracts'
import invariant from 'tiny-invariant'

export function handleTransact({
  args,
  transactor,
  contract,
  fnName,
  txOpts,
  version,
  optionalArgs = [],
}: {
  args: unknown[]
  transactor?: Transactor
  contract?: Contract
  txOpts?: Omit<TransactorOptions, 'value'>
  fnName: string
  version: 'v1' | 'v2'
  optionalArgs?: unknown[]
}) {
  // If transactor or contract is undefined
  // go directly to catch

  try {
    invariant(transactor && contract, 'missing required')
    const reqArgs = args.filter(arg => !optionalArgs.includes(arg))
    const isMissingParameter =
      args.length - optionalArgs.length !== reqArgs.length

    if (isMissingParameter) {
      throw new Error('missing parameter')
    }

    return transactor(contract, fnName, args, txOpts)
  } catch (e: unknown) {
    let missingParam: string | undefined
    if (e instanceof Error) {
      if (e.message.includes('missing required')) {
        // We know these params are always required
        missingParam = !transactor
          ? 'transactor'
          : !contract
          ? 'contract'
          : undefined
      }

      if (e.message.includes('missing parameter')) {
        let paramObj = {}
        const requiredParams = args.filter(arg => !optionalArgs.includes(arg))
        for (const arg of requiredParams) {
          paramObj = { ...paramObj, arg }
        }

        const argRequiredNames = Object.keys(
          paramObj,
        ) as (keyof typeof requiredParams)[]

        ;[missingParam] = argRequiredNames.find(
          arg => requiredParams[arg] === undefined,
        )
      }
    }
    // eslint-disable-next-line no-debugger
    debugger
    txOpts?.onError?.(new DOMException(missingParam))
    return onCatch(missingParam ?? '', fnName, version, txOpts)
  }
}
