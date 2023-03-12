import { LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
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
    <Space>
      {isProjectSplit(allocation) && allocation.projectId ? (
        <V2V3ProjectHandleLink projectId={parseInt(allocation.projectId)} />
      ) : (
        <FormattedAddress address={allocation.beneficiary} />
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
    </Space>
  )
}
