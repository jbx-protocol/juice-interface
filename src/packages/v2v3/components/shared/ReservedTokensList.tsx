import { DeleteOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { FormItemInput } from 'models/formItemInput'
import {
  Allocation,
  AllocationSplit,
} from 'packages/v2v3/components/shared/Allocation/Allocation'
import { AllocationItemTitle } from 'packages/v2v3/components/shared/Allocation/components/AllocationItemTitle'
import { OwnerPayoutCard } from 'packages/v2v3/components/shared/PayoutCard/OwnerPayoutCard'
import { totalSplitsPercent } from 'packages/v2v3/utils/v2v3Splits'
import { useMemo } from 'react'
import { formatPercent } from 'utils/format/formatPercent'
import { ceilIfCloseToNextInteger } from 'utils/math'

export const ReservedTokensList: React.FC<
  React.PropsWithChildren<
    FormItemInput<AllocationSplit[]> & { isEditable?: boolean }
  >
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
                    isEditable ? (
                      <Button
                        type="ghost"
                        className="h-8 border-0 px-2 py-1 text-black shadow-none hover:bg-smoke-200 dark:text-slate-100 dark:hover:bg-slate-300"
                        onClick={e => {
                          e.stopPropagation()
                          removeAllocation(allocation.id)
                        }}
                      >
                        <DeleteOutlined />
                      </Button>
                    ) : undefined
                  }
                  onClick={() => {
                    if (!isEditable) return
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
