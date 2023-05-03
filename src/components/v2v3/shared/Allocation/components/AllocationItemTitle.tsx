import { LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { formatDate } from 'utils/format/formatDate'
import { isProjectSplit } from 'utils/splits'
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
