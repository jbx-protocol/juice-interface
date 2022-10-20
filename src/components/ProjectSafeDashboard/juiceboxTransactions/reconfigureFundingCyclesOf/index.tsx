import { t } from '@lingui/macro'
import { getTransactionVersion } from 'utils/safe'
import { SafeTransactionComponentProps } from '../../SafeTransaction'
import { TransactionCollapse } from '../../TransactionCollapse'
import { ReconfigureRichPreview } from './ReconfigurationRichPreview'

export function ReconfigureFundingCyclesOfTransaction({
  transaction,
  selected,
  isPastTransaction,
}: SafeTransactionComponentProps) {
  const txVersion = getTransactionVersion(transaction)

  return (
    <TransactionCollapse
      transaction={transaction}
      title={t`Reconfigure funding cycle`}
      isPastTransaction={isPastTransaction}
      version={txVersion}
      selected={selected}
      expandedContent={<ReconfigureRichPreview transaction={transaction} />}
    />
  )
}
