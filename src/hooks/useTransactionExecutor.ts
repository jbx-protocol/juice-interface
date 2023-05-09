import { useState } from 'react'
import { TransactorInstance } from './useTransactor'

/**
 * Thin wrapper on useTransactor that handles loading state and error handling internally
 */
export function useTransactionExecutor<T>(
  tx: TransactorInstance<T>,
  {
    onConfirmed,
    onError,
  }: { onConfirmed?: VoidFunction; onError?: ErrorCallback } = {},
) {
  const [loading, setLoading] = useState<boolean>(false)

  const execute = async function (args: T) {
    setLoading(true)
    const res = await tx(args, {
      onConfirmed() {
        setLoading(false)
        return onConfirmed?.()
      },
      onError(e) {
        setLoading(false)
        console.error(e)
        onError?.(e)
      },
    })

    if (!res) {
      setLoading(false)
      onError?.(new Error('Transaction failed'))
    }
  }

  return { loading, execute }
}
