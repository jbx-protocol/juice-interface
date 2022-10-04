import { DeleteOutlined, LockFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { PayoutsSelection } from 'models/payoutsSelection'
import { formatDate } from 'utils/format/formatDate'
import { Allocation, AllocationSplit } from '../Allocation'
import { Amount } from './Amount'

export const PayoutCard = ({
  allocation,
  payoutsSelection,
  onClick,
  onDeleteClick,
}: {
  allocation: AllocationSplit
  payoutsSelection: PayoutsSelection
  onClick?: VoidFunction
  onDeleteClick?: VoidFunction
}) => {
  return (
    <Allocation.Item
      title={
        <Space>
          <FormattedAddress address={allocation.beneficiary} />
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
      }
      amount={
        <Amount
          allocationId={allocation.id}
          payoutsSelection={payoutsSelection}
        />
      }
      extra={
        <DeleteOutlined
          onClick={e => {
            e.stopPropagation()
            onDeleteClick?.()
          }}
        />
      }
      onClick={onClick}
    />
  )
}
