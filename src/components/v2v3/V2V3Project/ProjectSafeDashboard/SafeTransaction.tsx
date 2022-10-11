import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import { useContext, useMemo, useState } from 'react'
import { ReconfigureFundingCyclesOfTransaction } from './juiceboxTransactions/reconfigureFundingCyclesOf'
import { LinkToSafeButton } from './LinkToSafeButton'
import { TransactionHeader } from './TransactionHeader'

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
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [expanded, setExpanded] = useState<boolean>(selected)

  return (
    <div
      onClick={() => {
        setExpanded(!expanded)
      }}
      style={{ marginBottom: '1.5rem' }}
      id={`${transaction.safeTxHash}`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <TransactionHeader
          transaction={transaction}
          isPastTransaction={isPastTransaction}
        />
        <div style={{ marginLeft: 10, color: colors.text.tertiary }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {expanded ? (
        <LinkToSafeButton
          transaction={transaction}
          style={{ marginTop: '0.5rem' }}
        />
      ) : null}
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
