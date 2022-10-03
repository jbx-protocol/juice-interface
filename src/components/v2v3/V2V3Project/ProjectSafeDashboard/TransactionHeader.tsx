import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ThemeContext } from 'contexts/themeContext'
import { generateSafeTxUrl } from 'lib/safe'
import { CSSProperties, useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { SafeTransactionType } from '.'
import { ShareTxButton } from './ShareTxButton'

const nonceStyle: CSSProperties = {
  marginRight: '2rem',
  width: '1rem',
}

export function TransactionHeader({
  transaction,
  onClick,
  title,
}: {
  transaction: SafeTransactionType
  onClick?: VoidFunction
  title?: string
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
        <ShareTxButton
          transactionId={transaction.safeTxHash}
          style={{ marginLeft: 10 }}
        />
      </div>
      <div style={{ color: colors.text.secondary }}>
        {formatHistoricalDate(new Date(transaction.submissionDate).valueOf())}
      </div>
    </div>
  )
}
