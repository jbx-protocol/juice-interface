import { LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { isProjectSplit } from 'packages/v4/utils/v4Splits'
import { formatDate } from 'utils/format/formatDate'
import V4ProjectHandleLink from '../../V4ProjectHandleLink'
import { AllocationSplit } from '../Allocation'

export function AllocationItemTitle({
  allocation,
}: {
  allocation: AllocationSplit
}) {
  return (
    <div className="flex items-center gap-2">
      {isProjectSplit(allocation) && allocation.projectId ? (
        <V4ProjectHandleLink projectId={Number(allocation.projectId)} />
      ) : (
        <EthereumAddress address={allocation.beneficiary} />
      )}
      {!!allocation.lockedUntil && (
        <Tooltip
          title={t`Locked until ${formatDate(
            allocation.lockedUntil * 1000,
            'yyyy-MM-DD',
          )}`}
        >
          <LockFilled />
        </Tooltip>
      )}
    </div>
  )
}
