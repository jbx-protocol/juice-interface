import { useWallet } from 'hooks/Wallet'
import { TxStatus } from 'models/transaction'
import { useCallback, useEffect, useState } from 'react'
import { AddTransactionFunction, TransactionLog } from './TxHistoryContext'

// Arbitrary time to give folks a sense of tx history
const TX_HISTORY_TIME_SECS = 60 * 60 // 1 hr

const nowSeconds = () => Math.round(new Date().valueOf() / 1000)

export function useTransactions() {
  const [transactions, setTransactionsState] = useState<TransactionLog[]>([])
  const { userAddress, chain } = useWallet()

  const localStorageKey =
    chain && userAddress
      ? `transactions_${chain?.id}_${userAddress}`
      : undefined

  // Sets TransactionLogs in both localStorage and state
  // Ensures localStorage is always up to date, so we can persist good data on refresh
  const setTransactions = useCallback(
    (txs: TransactionLog[]) => {
      if (!localStorageKey) return

      localStorage.setItem(localStorageKey, JSON.stringify(txs))
      setTransactionsState(txs)
    },
    [localStorageKey],
  )

  const addTransaction: AddTransactionFunction = useCallback(
    (title, tx, callbacks) => {
      setTransactions([
        ...transactions,
        {
          // We use millis timestamp for id bcuz tx.hash may be undefined
          // UI couldn't create 2 txs at the same millisecond ...right?
          id: new Date().valueOf(),
          title,
          tx,
          createdAt: nowSeconds(),
          status: TxStatus.pending,
          callbacks,
        },
      ])
    },
    [transactions, setTransactions],
  )

  const removeTransaction = useCallback(
    (id: number) => {
      setTransactions(transactions.filter(tx => tx.id !== id))
    },
    [transactions, setTransactions],
  )

  // Load initial state
  useEffect(() => {
    if (!localStorageKey) {
      return
    }

    const txs = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    const pendingOrFailedTxs = txs.filter(
      (tx: TransactionLog) =>
        tx.status !== TxStatus.success ||
        nowSeconds() - TX_HISTORY_TIME_SECS < tx.createdAt,
    ) as TransactionLog[]

    setTransactions(pendingOrFailedTxs)
  }, [setTransactions, localStorageKey])

  return {
    transactions,
    addTransaction,
    removeTransaction,
    setTransactions,
  }
}
