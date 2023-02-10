import { CloseCircleOutlined } from '@ant-design/icons'
import ExternalLink from 'components/ExternalLink'
import TxStatusElem from 'components/TxStatusElem'
import { timestampForTxLog } from 'contexts/Transaction/TxHistoryContext'
import { TransactionLog } from 'models/transaction'
import { etherscanLink } from 'utils/etherscan'
import { formatHistoricalDate } from 'utils/format/formatDate'

export function TransactionItem({
  tx,
  onRemoveTransaction,
}: {
  tx: TransactionLog
  onRemoveTransaction?: VoidFunction
}) {
  return (
    <div className="box-border flex w-full items-center justify-between gap-6 border border-solid border-grey-300 bg-smoke-25 py-1 px-5 dark:border-slate-200 dark:bg-slate-800">
      <div className="leading-6">
        <div className="flex items-center gap-2 text-sm text-grey-400 dark:text-slate-200">
          <TxStatusElem status={tx.status} />{' '}
          {formatHistoricalDate(timestampForTxLog(tx) * 1000)}
        </div>

        <ExternalLink
          href={tx.tx?.hash ? etherscanLink('tx', tx.tx.hash) : undefined}
          className="text-sm text-black hover:text-haze-400 hover:underline dark:text-grey-100 dark:hover:text-haze-400"
        >
          {tx.title}
        </ExternalLink>
      </div>

      {onRemoveTransaction && (
        <CloseCircleOutlined
          role="button"
          className="hover:text-haze-400"
          onClick={() => {
            onRemoveTransaction()
          }}
        />
      )}
    </div>
  )
}
