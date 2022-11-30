import { TeamOutlined } from '@ant-design/icons'
import { SafeTransactionType } from 'models/safe'

export function TransactionSigStatus({
  transaction,
}: {
  transaction: SafeTransactionType
}) {
  return (
    <div className="flex items-center text-base text-black dark:text-slate-100">
      <TeamOutlined className="mr-1" />
      {transaction.confirmations?.length ?? 0}/{transaction.threshold}
    </div>
  )
}
