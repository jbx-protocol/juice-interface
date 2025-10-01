import { TrashIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { FormItemInput } from 'models/formItemInput'

import { SPLITS_TOTAL_PERCENT } from 'juice-sdk-core'
import { useMemo } from 'react'
import { totalSplitsPercent } from '../utils/v4Splits'
import { Allocation, AllocationSplit } from './Allocation/Allocation'
import { AllocationItemTitle } from './Allocation/components/AllocationItemTitle'
import { OwnerPayoutCard } from './PayoutCard/OwnerPayoutCard'

export const ReservedTokensList: React.FC<
  React.PropsWithChildren<
    FormItemInput<AllocationSplit[]> & { isEditable?: boolean }
  >
> = ({ isEditable, value, onChange }) => {
  const totalPercent = useMemo(
    () => (value ? totalSplitsPercent(value) : 0n),
    [value],
  )

  return (
    <Allocation value={value} onChange={onChange}>
      <div className="flex flex-col gap-4">
        {totalPercent < BigInt(SPLITS_TOTAL_PERCENT) ? (
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
                  amount={`${allocation.percent.formatPercentage()}%`}
                  extra={
                    isEditable ? (
                      <Button
                        type="ghost"
                        className="h-8 w-8 border-0 px-2 py-1 text-black shadow-none hover:bg-smoke-200 dark:text-slate-100 dark:hover:bg-slate-300"
                        onClick={e => {
                          e.stopPropagation()
                          removeAllocation(allocation.id)
                        }}
                      >
                        <TrashIcon />
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
