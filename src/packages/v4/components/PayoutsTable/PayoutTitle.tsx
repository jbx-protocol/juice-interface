import { LockClosedIcon } from '@heroicons/react/24/solid'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { JBSplit as Split } from 'juice-sdk-core'
import { formatDate } from 'utils/format/formatDate'
import V4ProjectHandleLink from '../V4ProjectHandleLink'
import { usePayoutsTableContext } from './context/PayoutsTableContext'

export function PayoutTitle({ payoutSplit }: { payoutSplit: Split }) {
  const { showAvatars } = usePayoutsTableContext()

  const isProject =
    Boolean(payoutSplit.projectId) && payoutSplit.projectId !== 0n

  return (
    <div className="flex items-center gap-2">
      {isProject ? (
        <V4ProjectHandleLink
          projectId={Number(payoutSplit.projectId)}
          withProjectAvatar={showAvatars}
        />
      ) : (
        <EthereumAddress
          address={payoutSplit.beneficiary}
          withEnsAvatar={showAvatars}
        />
      )}
      {!!payoutSplit.lockedUntil && (
        <Tooltip
          title={t`Locked until ${formatDate(
            payoutSplit.lockedUntil * 1000,
            'yyyy-MM-DD',
          )}`}
        >
          <LockClosedIcon className="inline h-4 w-4" />
        </Tooltip>
      )}
    </div>
  )
}
