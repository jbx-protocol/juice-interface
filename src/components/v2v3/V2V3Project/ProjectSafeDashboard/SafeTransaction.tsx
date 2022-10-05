import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import { CSSProperties, useContext, useMemo } from 'react'
import { ReconfigureFundingCyclesOfTransaction } from './juiceboxTransactions/reconfigureFundingCyclesOf'

import { TransactionHeader } from './TransactionHeader'

export type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
  selected: boolean
  isPastTransaction?: boolean
}

export const safeTransactionRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: 400,
  width: '100%',
  padding: '0.5rem 1rem',
  marginBottom: '1rem',
  transition: 'background-color 100ms linear',
}

const GenericSafeTransaction = ({
  transaction,
  selected,
  isPastTransaction,
}: SafeTransactionComponentProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        ...safeTransactionRowStyle,
        color: colors.text.primary,
        border: `1px solid ${
          selected ? colors.stroke.action.primary : colors.stroke.tertiary
        }`,
        paddingRight: '40px',
      }}
      id={`${transaction.safeTxHash}`}
    >
      <TransactionHeader
        transaction={transaction}
        isPastTransaction={isPastTransaction}
      />
    </div>
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

  if (!method) return null

  return (
    <TransactionContent
      transaction={transaction}
      selected={selected}
      isPastTransaction={isPastTransaction}
    />
  )
}
