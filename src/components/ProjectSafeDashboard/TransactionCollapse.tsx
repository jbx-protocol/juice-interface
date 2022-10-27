import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { CV_V1, CV_V2, CV_V3 } from 'constants/cv'
import { ThemeContext } from 'contexts/themeContext'
import { CV } from 'models/cv'
import { SafeTransactionType } from 'models/safe'
import Link from 'next/link'
import { CSSProperties, useContext, useState } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { TransactionSigStatus } from './TransactionSigStatus'

const headerRowStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  padding: '1rem',
}

export function TransactionCollapse({
  transaction,
  selected,
  title,
  isPastTransaction,
  version,
  expandedContent,
}: {
  transaction: SafeTransactionType
  selected?: boolean
  title?: string
  isPastTransaction?: boolean
  version?: CV
  expandedContent?: JSX.Element
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const transactionTitle =
    title ?? transaction?.dataDecoded?.method ?? 'Send funds' // transactions with no data are 'Send' txs

  const [expanded, setExpanded] = useState<boolean>(Boolean(selected))

  let versionText: string | undefined
  switch (version) {
    case CV_V1:
      versionText = 'V1'
      break
    case CV_V2:
      versionText = 'V2'
      break
    case CV_V3:
      versionText = 'V3'
      break
  }

  const collapseStyle: CSSProperties = {
    color: colors.text.primary,
    borderTop: 'unset',
    borderRight: 'unset',
    borderLeft: 'unset',
  }

  return (
    <div style={collapseStyle} id={`${transaction.safeTxHash}`}>
      <div
        style={headerRowStyle}
        className="hover-bg-l2"
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            minHeight: '1.8rem', // account for possibility of version badge
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link href={`#${transaction.safeTxHash}`}>
              <a className="text-primary hover-text-decoration-underline">
                {transactionTitle}
              </a>
            </Link>
            {versionText ? (
              <ProjectVersionBadge
                versionText={versionText}
                style={{ marginLeft: '00.75rem' }}
              />
            ) : null}
          </div>
          <div
            style={{
              width: '200px',
              color: colors.text.tertiary,
              display: 'flex',
              justifyContent: isPastTransaction ? 'flex-end' : 'space-between',
              alignItems: 'center',
            }}
          >
            {isPastTransaction ? null : (
              <TransactionSigStatus transaction={transaction} />
            )}
            {formatHistoricalDate(
              new Date(transaction.submissionDate).valueOf(),
            )}
          </div>
        </div>
        <div style={{ marginLeft: 10, color: colors.text.tertiary }}>
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>
      {expanded ? (
        <div style={{ paddingBottom: '1rem' }}>{expandedContent}</div>
      ) : null}
    </div>
  )
}
