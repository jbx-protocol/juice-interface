import { Contract } from '@ethersproject/contracts'
import { Transactor, TransactorOptions } from 'hooks/Transactor'
import { isUndefined } from 'lodash'
import invariant from 'tiny-invariant'

export function handleTransactor(props: {
  fnName: string
  args: unknown[]
  version: 'v1' | 'v2'
  transactor?: Transactor
  contract?: Contract
  txOpts?: Omit<TransactorOptions, 'value'>
}): Promise<boolean> {
  const { transactor, contract, fnName, txOpts, version, args } = props

  const params = Object.keys(props) as ReturnType<() => keyof typeof props>[]
  const missingParam = params.find(param => !props[param])
  const argParams = args.filter(arg => !isUndefined(arg)).join(', ')

  try {
    invariant(
      transactor && contract && args && fnName && argParams && missingParam,
    )
    return transactor(contract, fnName, args, txOpts)
  } catch (e) {
    return onCatch(
      `${missingParam ?? ''} ${argParams ?? ''}`,
      fnName,
      version,
      txOpts,
    )
  }
}

export function onCatch(
  missingParam: string,
  fnName: string,
  version: 'v1' | 'v2',
  txOpts?: Omit<TransactorOptions, 'value'>,
) {
  txOpts?.onError?.(
    new DOMException(
      `Missing ${
        missingParam ?? 'parameter` not found'
      } in ${version} ${fnName}`,
    ),
  )

  txOpts?.onDone?.()
  return Promise.resolve(false)
}
