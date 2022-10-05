import { ThemeContext } from 'contexts/themeContext'
import { SafeTransactionType } from 'models/safe'
import Link from 'next/link'
import { CSSProperties, useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
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
        <div style={{ ...nonceStyle, color: colors.text.secondary }}>
          {transaction.nonce}
        </div>
        <Link href={`#${transaction.safeTxHash}`}>
          <a className="text-primary hover-text-decoration-underline">
            {transactionTitle}
          </a>
        </Link>
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
