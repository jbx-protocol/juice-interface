import { LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import V2V3ProjectHandleLink from 'packages/v2v3/components/shared/V2V3ProjectHandleLink'
import { isProjectSplit } from 'packages/v2v3/utils/v2v3Splits'
import { formatDate } from 'utils/format/formatDate'
import { AllocationSplit } from '../Allocation'

export function AllocationItemTitle({
  allocation,
}: {
  allocation: AllocationSplit
}) {
  return (
    <div className="flex items-center gap-2">
      {isProjectSplit(allocation) && allocation.projectId ? (
        <V2V3ProjectHandleLink projectId={parseInt(allocation.projectId)} />
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
