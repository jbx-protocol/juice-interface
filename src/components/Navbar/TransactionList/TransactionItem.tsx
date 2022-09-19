import { CloseCircleOutlined } from '@ant-design/icons'
import TxStatusElem from 'components/TxStatusElem'
import { ThemeContext } from 'contexts/themeContext'
import { timestampForTxLog } from 'contexts/txHistoryContext'
import { TransactionLog } from 'models/transaction'
import { useContext } from 'react'
import { etherscanLink } from 'utils/etherscan'
import { formatHistoricalDate } from 'utils/format/formatDate'

export function TransactionItem({
  tx,
  onRemoveTransaction,
}: {
  tx: TransactionLog
  onRemoveTransaction?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
        padding: '5px 20px',
        background: colors.background.l0,
        border: `1px solid ${colors.stroke.secondary}`,
        boxSizing: 'border-box',
      }}
    >
      <a
        style={{
          cursor: tx.tx.hash ? 'pointer' : 'default',
          color: colors.text.primary,
          fontSize: '0.7rem',
          lineHeight: '1.5rem',
        }}
        href={tx.tx.hash ? etherscanLink('tx', tx.tx.hash) : undefined}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            color: colors.text.tertiary,
          }}
        >
          <TxStatusElem status={tx.status} />{' '}
          {formatHistoricalDate(timestampForTxLog(tx) * 1000)}
        </div>
        <div style={{ fontSize: '0.85rem' }}>{tx.title}</div>
      </a>

      {onRemoveTransaction && (
        <CloseCircleOutlined
          style={{ cursor: 'default' }}
          onClick={() => {
            onRemoveTransaction()
          }}
        />
      )}
    </div>
  )
}
