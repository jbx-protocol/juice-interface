import { getTransactionReceipt } from '@wagmi/core'
import { TxStatus } from 'models/transaction'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { ReactNode, useEffect } from 'react'
import { TransactionLog, TxHistoryContext } from './TxHistoryContext'
import { useTransactions } from './useTransactions'

const nowSeconds = () => Math.round(new Date().valueOf() / 1000)

const SHORT_POLL_INTERVAL_MILLISECONDS = 3 * 1000 // 3 sec
const LONG_POLL_INTERVAL_MILLISECONDS = 12 * 1000 // 12 sec

const pollTransaction = async (
  txLog: TransactionLog,
): Promise<TransactionLog> => {
  // Only do refresh logic for pending txs
  // tx.hash shouldn't ever be undefined but it's optional typed :shrug:
  if (!txLog.tx?.hash) {
    return txLog
  }

  try {
    // this throws if the tx hasnt been mined
    const response = await getTransactionReceipt(wagmiConfig, {
      hash: txLog.tx.hash,
    })

    return {
      ...txLog,
      status:
        response.status === 'success' ? TxStatus.success : TxStatus.failed,
    }
  } catch {
    return txLog
  }

  return txLog
}

export default function WagmiTxHistoryProvider({
  children,
}: {
  children: ReactNode
}) {
  const { transactions, addTransaction, removeTransaction, setTransactions } =
    useTransactions()

  // Setup poller for refreshing transactions
  useEffect(() => {
    // Only set new poller if there are pending transactions
    // Succeeded/failed txs don't need to be refreshed
    if (!transactions.some(tx => tx.status === TxStatus.pending)) {
      return
    }

    // If any pending txs were created less than 3 min ago, use short poll time
    // Otherwise use longer poll time
    // (Assume no need for quick UX if user has already waited 3 min)
    const threeMinutesAgo = nowSeconds() - 3 * 60
    const pollInterval = transactions.some(
      tx => tx.status === TxStatus.pending && threeMinutesAgo < tx.createdAt,
    )
      ? SHORT_POLL_INTERVAL_MILLISECONDS
      : LONG_POLL_INTERVAL_MILLISECONDS

    console.info('WagmiTxHistoryProvider::Setting poller', pollInterval)

    const poller = setInterval(async () => {
      console.info('WagmiTxHistoryProvider::poller::polling for tx updates...')

      const transactionLogs = await Promise.all(
        transactions.map(txLog => {
          return pollTransaction(txLog)
        }),
      )

      console.info(
        'WagmiTxHistoryProvider::poller::updating transactions state',
        transactionLogs,
      )
      setTransactions(transactionLogs)
    }, pollInterval)

    // Clean up
    return () => {
      console.info('WagmiTxHistoryProvider::poller::removing poller')

      clearInterval(poller)
    }
  }, [transactions, setTransactions])

  return (
    <TxHistoryContext.Provider
      value={{
        transactions,
        addTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TxHistoryContext.Provider>
  )
}
