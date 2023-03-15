import { DeleteOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Space } from 'antd'
import { Allocation, AllocationSplit } from 'components/Allocation'
import { AllocationItemTitle } from 'components/Allocation/components/AllocationItemTitle'
import { OwnerPayoutCard } from 'components/PayoutCard'
import { FormItemInput } from 'models/formItemInput'
import { formatPercent } from 'utils/format/formatPercent'

export const ReservedTokensList: React.FC<
  FormItemInput<AllocationSplit[]> & { isEditable?: boolean }
> = ({ isEditable, value, onChange }) => {
  return (
    <Allocation value={value} onChange={onChange}>
      <Space className="w-full" direction="vertical" size="middle">
        <OwnerPayoutCard payoutsSelection={'percentages'} />
        <Allocation.List
          allocationName={t`reserved token recipient`}
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
                  title={<AllocationItemTitle allocation={allocation} />}
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
