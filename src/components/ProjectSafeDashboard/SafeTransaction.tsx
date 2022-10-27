import { SafeTransactionType } from 'models/safe'
import { useMemo } from 'react'
import { ReconfigureFundingCyclesOfTransaction } from './juiceboxTransactions/reconfigureFundingCyclesOf'
import { LinkToSafeButton } from './LinkToSafeButton'
import { TransactionCollapse } from './TransactionCollapse'

export type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
  selected: boolean
  isPastTransaction?: boolean
}

const GenericSafeTransaction = ({
  transaction,
  selected,
  isPastTransaction,
}: SafeTransactionComponentProps) => {
  return (
    <TransactionCollapse
      transaction={transaction}
      selected={selected}
      isPastTransaction={isPastTransaction}
      expandedContent={
        <LinkToSafeButton
          transaction={transaction}
          style={{ marginTop: '0.5rem' }}
        />
      }
    />
  )
}

const TRANSACTION_METHOD_COMPONENTS_MAP: {
  [k: string]: (props: SafeTransactionComponentProps) => JSX.Element | null
} = {
  reconfigureFundingCyclesOf: ReconfigureFundingCyclesOfTransaction,
}

export function SafeTransaction({
  transaction,
  selected,
  isPastTransaction,
}: SafeTransactionComponentProps) {
  const { method } = transaction.dataDecoded ?? {}

  const TransactionContent = useMemo(() => {
    if (!method) return GenericSafeTransaction // only the header
    return TRANSACTION_METHOD_COMPONENTS_MAP[method] ?? GenericSafeTransaction
  }, [method])

  return (
    <TransactionContent
      transaction={transaction}
      selected={selected}
      isPastTransaction={isPastTransaction}
    />
  )
}
