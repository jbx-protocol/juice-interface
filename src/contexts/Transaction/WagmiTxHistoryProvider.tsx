import { ReactNode } from 'react'
import { TxHistoryContext } from './TxHistoryContext'
import { useTransactions } from './useTransactions'

export default function WagmiTxHistoryProvider({
  children,
}: {
  children: ReactNode
}) {
  const { transactions, addTransaction, removeTransaction } = useTransactions()
  // TODO implement polling/wait logic using Wagmi
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
