import { ThemeContext } from 'contexts/themeContext'
import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { CSSProperties, useContext } from 'react'
import { SafeTransaction } from './SafeTransaction'

export const safeNonceRowStyle: CSSProperties = {
  justifyContent: 'space-between',
  fontWeight: 400,
  width: '100%',
  transition: 'background-color 100ms linear',
  display: 'flex',
  borderTop: 'unset',
  borderLeft: 'unset',
  borderRight: 'unset',
  paddingLeft: '1rem',
}

export function SafeNonceRow({
  nonce,
  transactions,
  selectedTx,
  isHistory,
  safe,
}: {
  nonce: number
  transactions: SafeTransactionType[]
  isHistory?: boolean
  selectedTx: string | undefined
  safe: GnosisSafe
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
    borderBottom: `1px solid ${
      containsSelectedTx
        ? colors.stroke.action.primary
        : colors.stroke.secondary
    }`,
  }

  return (
    <div style={rowStyle} id={`safe-nonce-${nonce}`}>
      <div
        style={{
          color: colors.text.secondary,
          paddingRight: '2rem',
          paddingTop: '1.2rem',
          minWidth: '3.6rem', // account for double/triple digit nonces (keep tx titles in line)
        }}
      >
        {nonce}
      </div>
      <div style={{ width: '100%' }}>
        {transactions.map((tx: SafeTransactionType, idx: number) => (
          <div
            key={idx}
            style={{
              borderTop:
                idx === 0 ? 'unset' : `1px solid ${colors.stroke.tertiary}`,
            }}
          >
            <SafeTransaction
              safe={safe}
              transaction={{ ...tx, threshold: safe.threshold }}
              selected={selectedTx === tx.safeTxHash}
              isPastTransaction={isHistory}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
