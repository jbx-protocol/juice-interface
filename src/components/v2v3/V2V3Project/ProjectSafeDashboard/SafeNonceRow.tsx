import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import { CSSProperties, useContext } from 'react'
import { SafeTransaction } from './SafeTransaction'

export const safeNonceRowStyle: CSSProperties = {
  justifyContent: 'space-between',
  fontWeight: 400,
  width: '100%',
  padding: '1.5rem 1.5rem 0.5rem 0',
  transition: 'background-color 100ms linear',
  display: 'flex',
  cursor: 'pointer',
  borderTop: 'unset',
  borderLeft: 'unset',
  borderRight: 'unset',
}

export function SafeNonceRow({
  nonce,
  transactions,
  selectedTx,
  safeThreshold,
}: {
  nonce: number
  transactions: SafeTransactionType[]
  selectedTx: string | undefined
  safeThreshold: number
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const containsSelectedTx = transactions.some(
    (tx: SafeTransactionType) => tx.safeTxHash === selectedTx,
  )

  const rowStyle: CSSProperties = {
    ...safeNonceRowStyle,
    color: colors.text.primary,
  }

  if (containsSelectedTx) {
    rowStyle.borderBottom = `1px solid ${colors.stroke.action.primary}`
  }

  return (
    <div
      className="clickable-border"
      style={rowStyle}
      id={`safe-nonce-${nonce}`}
    >
      <div
        style={{
          color: colors.text.secondary,
          paddingRight: '2rem',
        }}
      >
        {nonce}
      </div>
      <div style={{ width: '100%' }}>
        {transactions.map((tx: SafeTransactionType, idx: number) => (
          <SafeTransaction
            key={idx}
            transaction={{ ...tx, threshold: safeThreshold }}
            selected={selectedTx === tx.safeTxHash}
          />
        ))}
      </div>
    </div>
  )
}
