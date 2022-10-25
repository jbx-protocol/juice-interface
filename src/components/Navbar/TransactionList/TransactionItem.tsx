import { CloseCircleOutlined } from '@ant-design/icons'
import ExternalLink from 'components/ExternalLink'
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
        gap: 24,
        width: '100%',
        padding: '5px 20px',
        background: colors.background.l0,
        border: `1px solid ${colors.stroke.secondary}`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          lineHeight: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            color: colors.text.tertiary,
            fontSize: '0.75rem',
          }}
        >
          <TxStatusElem status={tx.status} />{' '}
          {formatHistoricalDate(timestampForTxLog(tx) * 1000)}
        </div>

        <ExternalLink
          href={tx.tx?.hash ? etherscanLink('tx', tx.tx.hash) : undefined}
          style={{ fontSize: '0.85rem' }}
          className="text-primary hover-text-decoration-underline"
        >
          {tx.title}
        </ExternalLink>
      </div>

      {onRemoveTransaction && (
        <CloseCircleOutlined
          role="button"
          className="hover-text-action-primary"
          onClick={() => {
            onRemoveTransaction()
          }}
        />
      )}
    </div>
  )
}
