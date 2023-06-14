import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { CV_V2, CV_V3 } from 'constants/cv'
import { SafeTransactionType } from 'models/safe'
import { V1TerminalVersion } from 'models/v1/terminals'
import { CV2V3 } from 'models/v2v3/cv'
import Link from 'next/link'
import { useState } from 'react'
import { classNames } from 'utils/classNames'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { TransactionSigStatus } from './TransactionSigStatus'

export function TransactionCollapse({
  transaction,
  selected,
  title,
  isPastTransaction,
  cv,
  expandedContent,
}: {
  transaction: SafeTransactionType
  selected?: boolean
  title?: string
  isPastTransaction?: boolean
  cv?: CV2V3 | V1TerminalVersion
  expandedContent?: JSX.Element
}) {
  const transactionTitle =
    title ?? transaction?.dataDecoded?.method ?? 'Send funds' // transactions with no data are 'Send' txs

  const [expanded, setExpanded] = useState<boolean>(Boolean(selected))

  let versionText: string | undefined
  switch (cv) {
    case '1':
    case '1.1':
      versionText = 'V1'
      break
    case CV_V2:
      versionText = 'V2'
      break
    case CV_V3:
      versionText = 'V3'
      break
  }

  return (
    <div
      className="cursor-pointer text-black dark:text-slate-100"
      id={`${transaction.safeTxHash}`}
    >
      <div
        className="flex w-full items-center p-4 hover:bg-smoke-75 dark:hover:bg-slate-400"
        onClick={() => {
          setExpanded(!expanded)
        }}
      >
        <div
          className={classNames(
            'flex w-full justify-between',
            'min-h-[1.8rem]', // account for possibility of version badge
          )}
        >
          <div className="flex items-center">
            <Link
              href={`#${transaction.safeTxHash}`}
              className="text-black hover:text-bluebs-500 hover:underline dark:text-grey-100 dark:hover:text-bluebs-500"
            >
              {transactionTitle}
            </Link>
            {versionText ? (
              <ProjectVersionBadge className="ml-3" versionText={versionText} />
            ) : null}
          </div>
          <div
            className={classNames(
              'flex w-52 items-center text-grey-400 dark:text-slate-200',
              isPastTransaction ? 'justify-end' : 'justify-between',
            )}
          >
            {isPastTransaction ? null : (
              <TransactionSigStatus transaction={transaction} />
            )}
            {formatHistoricalDate(
              new Date(transaction.submissionDate).valueOf(),
            )}
          </div>
        </div>
        <div className="ml-2 text-grey-400 dark:text-slate-200">
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </div>
      </div>
      {expanded ? (
        <div className="-ml-14 pb-4 md:ml-0">{expandedContent}</div>
      ) : null}
    </div>
  )
}
