import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ThemeContext } from 'contexts/themeContext'
import { generateSafeTxUrl } from 'lib/safe'
import { SafeTransactionType } from 'models/safe'
import { CSSProperties, useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { ShareTxButton } from './ShareTxButton'
import { TransactionSigStatus } from './TransactionSigStatus'

const nonceStyle: CSSProperties = {
  marginRight: '2rem',
  width: '1rem',
}

export function TransactionHeader({
  transaction,
  onClick,
  title,
  isPastTransaction,
}: {
  transaction: SafeTransactionType
  onClick?: VoidFunction
  title?: string
  isPastTransaction?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const _method = title ?? transaction?.dataDecoded?.method
  const transactionTitle = (
    <Tooltip title={t`Go to Safe`}>
      <ExternalLink
        href={generateSafeTxUrl(transaction)}
        className="hover-text-action-primary hover-text-decoration-underline color-unset"
        onClick={e => e.stopPropagation()}
      >
        {_method}
      </ExternalLink>
    </Tooltip>
  )

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
      id={`${transaction.safeTxHash}`}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ ...nonceStyle, color: colors.text.secondary }}>
          {transaction.nonce}
        </div>
        {transactionTitle}
        <ShareTxButton transaction={transaction} style={{ marginLeft: 10 }} />
      </div>
      <div
        style={{
          width: '200px',
          color: colors.text.secondary,
          display: 'flex',
          justifyContent: isPastTransaction ? 'flex-end' : 'space-between',
        }}
      >
        {isPastTransaction ? null : (
          <TransactionSigStatus transaction={transaction} />
        )}
        {formatHistoricalDate(new Date(transaction.submissionDate).valueOf())}
      </div>
    </div>
  )
}
