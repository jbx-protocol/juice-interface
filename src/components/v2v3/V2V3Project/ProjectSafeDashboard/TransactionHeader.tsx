import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import Link from 'next/link'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { TransactionSigStatus } from './TransactionSigStatus'

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
  const transactionTitle = title ?? transaction?.dataDecoded?.method

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href={`#${transaction.safeTxHash}`}>
          <a className="text-primary hover-text-decoration-underline">
            {transactionTitle}
          </a>
        </Link>
      </div>
      <div
        style={{
          width: '200px',
          color: colors.text.tertiary,
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
