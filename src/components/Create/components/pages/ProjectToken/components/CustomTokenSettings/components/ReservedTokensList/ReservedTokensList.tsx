import { DeleteOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Allocation, AllocationSplit } from 'components/Allocation'
import { AllocationItemTitle } from 'components/Allocation/components/AllocationItemTitle'
import { OwnerPayoutCard } from 'components/PayoutCard'
import { FormItemInput } from 'models/formItemInput'
import { useMemo } from 'react'
import { formatPercent } from 'utils/format/formatPercent'
import { ceilIfCloseToNextInteger } from 'utils/math'
import { totalSplitsPercent } from 'utils/splits'

export const ReservedTokensList: React.FC<
  FormItemInput<AllocationSplit[]> & { isEditable?: boolean }
> = ({ isEditable, value, onChange }) => {
  const totalPercent = useMemo(
    () => (value ? totalSplitsPercent(value) : 0),
    [value],
  )
  return (
    <Allocation value={value} onChange={onChange}>
      <div className="flex flex-col gap-4">
        {ceilIfCloseToNextInteger(totalPercent) < 100 ? (
          <OwnerPayoutCard payoutsSelection={'percentages'} />
        ) : null}
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
      </div>
    </Allocation>
  )
}
