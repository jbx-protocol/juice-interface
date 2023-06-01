import { SafeTransactionType } from 'models/safe'
import { useMemo } from 'react'
import { LinkToSafeButton } from './LinkToSafeButton'
import { TransactionCollapse } from './TransactionCollapse'
import { ReconfigureFundingCyclesOfTransaction } from './juiceboxTransactions/reconfigureFundingCyclesOf'
import { ReconfigureV1Transaction } from './juiceboxTransactions/reconfigureFundingCyclesOf/ReconfigureV1Transaction'

export type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
  selected: boolean
  title?: string
  isPastTransaction?: boolean
}

export const GenericSafeTransaction = ({
  transaction,
  selected,
  title,
  isPastTransaction,
}: SafeTransactionComponentProps) => {
  return (
    <TransactionCollapse
      transaction={transaction}
      title={title}
      selected={selected}
      isPastTransaction={isPastTransaction}
      expandedContent={
        <LinkToSafeButton className="mt-2" transaction={transaction} />
      }
    />
  )
}

const TRANSACTION_METHOD_COMPONENTS_MAP: {
  [k: string]: (props: SafeTransactionComponentProps) => JSX.Element | null
} = {
  reconfigureFundingCyclesOf: ReconfigureFundingCyclesOfTransaction,
  configure: ReconfigureV1Transaction,
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
