import { t } from '@lingui/macro'
import { Space } from 'antd'
import { OwnerPayoutCard } from 'components/Create/components/PayoutCard'
import { PayoutCard } from 'components/Create/components/PayoutCard/PayoutCard'
import { FormItemInput } from 'models/formItemInput'
import { PayoutsSelection } from 'models/payoutsSelection'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { Allocation, AllocationSplit } from '../../../../Allocation'

export const PayoutsList = (
  props: FormItemInput<AllocationSplit[]> & {
    payoutsSelection: PayoutsSelection
    isEditable?: boolean
  },
) => {
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()

  const availableModes: Set<'amount' | 'percentage'> = useMemo(
    () =>
      new Set(
        props.payoutsSelection === 'amounts' ? ['amount'] : ['percentage'],
      ),
    [props.payoutsSelection],
  )

  const setCurrency = useCallback(
    (currency: V2V3CurrencyOption) => {
      if (!distributionLimit?.amount) {
        console.warn(
          'Allocation.setCurrency called with no distribution limit set in editing',
          { distributionLimit },
        )
        return
      }
      setDistributionLimit({ amount: distributionLimit?.amount, currency })
    },
    [distributionLimit, setDistributionLimit],
  )

  return (
    <Allocation
      {...props}
      allocationCurrency={distributionLimit?.currency}
      totalAllocationAmount={distributionLimit?.amount}
      setAllocationCurrency={setCurrency}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <OwnerPayoutCard payoutsSelection={props.payoutsSelection} />
        <Allocation.List
          addText={t`Add new payout address`}
          isEditable={props.isEditable}
          availableModes={availableModes}
        >
          {(
            modal,
            { allocations, removeAllocation, setSelectedAllocation },
          ) => (
            <>
              {allocations.map(allocation => (
                <PayoutCard
                  payoutsSelection={props.payoutsSelection}
                  key={allocation.id}
                  allocation={allocation}
                  onDeleteClick={() => removeAllocation(allocation.id)}
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
