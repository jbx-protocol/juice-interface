import { DeleteOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Space, Tooltip } from 'antd'
import { Allocation, AllocationSplit } from 'components/Allocation'
import { OwnerPayoutCard } from 'components/PayoutCard'
import { formatPercent } from 'utils/format/formatPercent'
import FormattedAddress from 'components/FormattedAddress'
import { FormItemInput } from 'models/formItemInput'
import { formatDate } from 'utils/format/formatDate'

export const ReservedTokensList: React.FC<
  FormItemInput<AllocationSplit[]> & { isEditable?: boolean }
> = ({ isEditable, value, onChange }) => {
  return (
    <Allocation value={value} onChange={onChange}>
      <Space className="w-full" direction="vertical" size="middle">
        <OwnerPayoutCard payoutsSelection={'percentages'} />
        <Allocation.List
          allocationName={t`token allocation`}
          availableModes={new Set(['percentage'])}
          isEditable={isEditable}
        >
          {(
            modal,
            { allocations, removeAllocation, setSelectedAllocation },
          ) => (
            <>
              {allocations.map(allocation => (
                <Allocation.Item
                  key={allocation.id}
                  title={
                    <Space>
                      <FormattedAddress address={allocation.beneficiary} />
                      {!!allocation.lockedUntil && (
                        <Tooltip
                          title={t`Locked until ${formatDate(
                            allocation.lockedUntil * 1000,
                            'yyyy-MM-DD',
                          )}`}
                        />
                      )}
                    </Space>
                  }
                  amount={formatPercent(allocation.percent)}
                  extra={
                    <DeleteOutlined
                      onClick={e => {
                        e.stopPropagation()
                        removeAllocation(allocation.id)
                      }}
                    />
                  }
                  onClick={() => {
                    setSelectedAllocation(allocation)
                    modal.open()
                  }}
                />
              ))}
            </>
          )}
        </Allocation.List>
      </Space>
    </Allocation>
  )
}
