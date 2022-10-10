import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { ReconfigureFundingCyclesOfTransaction } from './juiceboxTransactions/reconfigureFundingCyclesOf'
import { LinkToSafeButton } from './LinkToSafeButton'
import { TransactionHeader } from './TransactionHeader'

export type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
  selected: boolean
  isPastTransaction?: boolean
}

export const safeTransactionRowStyle: CSSProperties = {
  justifyContent: 'space-between',
  fontWeight: 400,
  width: '100%',
  padding: '0.5rem 1rem',
  marginBottom: '1rem',
  transition: 'background-color 100ms linear',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
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

  const rowStyle: CSSProperties = {
    ...safeTransactionRowStyle,
    color: colors.text.primary,
    paddingRight: '1rem',
  }

  if (selected) {
    rowStyle.border = `1px solid ${colors.stroke.action.primary}`
  }

  return (
    <div
      className="clickable-border"
      style={rowStyle}
      onClick={() => {
        setExpanded(!expanded)
      }}
      id={`${transaction.safeTxHash}`}
    >
      <div style={{ display: 'flex', width: '100%' }}>
        <TransactionHeader
          transaction={transaction}
          isPastTransaction={isPastTransaction}
        />
        <div style={{ marginLeft: 10 }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>

      {expanded ? (
        <LinkToSafeButton
          transaction={transaction}
          style={{
            marginTop: '1rem',
          }}
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
