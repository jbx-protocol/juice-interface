import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { ThemeContext } from 'contexts/themeContext'
import { generateSafeTxUrl } from 'lib/safe'
import { CSSProperties, useContext, useMemo } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { ReconfigureFundingCyclesOfTransaction } from './juiceboxTransactions/reconfigureFundingCyclesOf'

import { SafeTransactionType } from './ProjectSafeDashboard'

export type SafeTransactionComponentProps = {
  transaction: SafeTransactionType
}

const nonceStyle: CSSProperties = {
  marginRight: '2rem',
  width: '1rem',
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
    >
      <div style={{ display: 'flex' }}>
        <div style={{ ...nonceStyle, color: colors.text.secondary }}>
          {transaction.nonce}
        </div>
        {transactionTitle}
      </div>
      <div style={{ color: colors.text.secondary }}>
        {formatHistoricalDate(new Date(transaction.submissionDate).valueOf())}
      </div>
    </div>
  )
}

const GenericSafeTransaction = ({
  transaction,
}: SafeTransactionComponentProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div
      style={{
        ...safeTransactionRowStyle,
        color: colors.text.primary,
        border: `1px solid ${colors.stroke.tertiary}`,
      }}
    >
      <TransactionHeader transaction={transaction} />
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
}: {
  transaction: SafeTransactionType
}) {
  const { method } = transaction.dataDecoded ?? {}

  const TransactionContent = useMemo(() => {
    if (!method) return GenericSafeTransaction // only the header
    return TRANSACTION_METHOD_COMPONENTS_MAP[method] ?? GenericSafeTransaction
  }, [method])

  if (!method) return null

  return <TransactionContent transaction={transaction} />
}
