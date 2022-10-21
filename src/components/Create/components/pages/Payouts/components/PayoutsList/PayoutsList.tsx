import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { Button, Divider, Space } from 'antd'
import { CreateCallout } from 'components/Create/components/CreateCallout'
import { OwnerPayoutCard } from 'components/Create/components/PayoutCard'
import { PayoutCard } from 'components/Create/components/PayoutCard/PayoutCard'
import { useFundingTarget } from 'components/Create/components/RecallCard/hooks'
import { ThemeContext } from 'contexts/themeContext'
import { FormItemInput } from 'models/formItemInput'
import { PayoutsSelection } from 'models/payoutsSelection'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useContext, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { Allocation, AllocationSplit } from '../../../../Allocation'

const calculateExpenseFromPercentageOfWad = ({
  percentage,
  wad,
}: {
  percentage: number
  wad: BigNumber
}) => {
  return parseFloat(fromWad(wad)) * (percentage / 100)
}

export const PayoutsList = (
  props: FormItemInput<AllocationSplit[]> & {
    payoutsSelection: PayoutsSelection
    isEditable?: boolean
  },
) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()
  const fundingTarget = useFundingTarget()

  const totalPercent = useMemo(
    () =>
      props.value?.reduce((acc, allocation) => {
        return acc + allocation.percent
      }, 0) ?? 0,
    [props.value],
  )

  const expenses = useMemo(() => {
    if (!distributionLimit?.amount) return 0
    return calculateExpenseFromPercentageOfWad({
      percentage: totalPercent,
      wad: distributionLimit.amount,
    })
  }, [distributionLimit?.amount, totalPercent])

  const expensesExceedsFundingTarget = useMemo(() => {
    return totalPercent > 100
  }, [totalPercent])

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

  const syncExpenses = useCallback(() => {
    if (!expenses) {
      console.warn(
        'Allocation.syncExpenses called with no expenses set in editing',
        { distributionLimit },
      )
      return
    }
    if (distributionLimit?.currency === undefined) {
      console.warn(
        'Allocation.syncExpenses called with no currency set in editing',
        { distributionLimit },
      )
      return
    }
    const newAllocationsWithUpdatedPercents =
      props.value?.map(allocation => {
        const individualExpense = calculateExpenseFromPercentageOfWad({
          percentage: allocation.percent,
          wad: distributionLimit.amount,
        })
        const newPercent = (individualExpense / expenses) * 100
        return {
          ...allocation,
          percent: newPercent,
        }
      }) ?? []
    const newAmount = parseWad(expenses)
    setDistributionLimit({
      amount: newAmount,
      currency: distributionLimit.currency,
    })
    props.onChange?.(newAllocationsWithUpdatedPercents)
  }, [distributionLimit, expenses, props, setDistributionLimit])

  return (
    <Allocation
      {...props}
      allocationCurrency={distributionLimit?.currency}
      totalAllocationAmount={distributionLimit?.amount}
      setAllocationCurrency={setCurrency}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {!(Math.round(totalPercent * 10000) / 10000 >= 100) && (
          <OwnerPayoutCard payoutsSelection={props.payoutsSelection} />
        )}
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
        {!distributionLimit?.amount.eq(MAX_DISTRIBUTION_LIMIT) && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: '1rem',
              }}
            >
              <span>Current Funding Target: {fundingTarget}</span>
              <Divider
                type="vertical"
                style={{ height: '1.5rem', margin: '0 1rem' }}
              />
              <span>
                Expenses:{' '}
                {formatCurrencyAmount({
                  amount: expenses,
                  currency: distributionLimit?.currency,
                })}
              </span>
            </div>
          </>
        )}
        {!distributionLimit?.amount.eq(MAX_DISTRIBUTION_LIMIT) &&
          expensesExceedsFundingTarget && (
            <CreateCallout.Warning>
              <h3>Funding Target Exceeded</h3>
              <p>
                The sum of your expenses is currently different to your funding
                target. Do you want to sync your funding target to match
                expenses?
              </p>
              <Button
                type="text"
                style={{
                  backgroundColor: colors.text.warn,
                  color: colors.text.over.action.primary,
                }}
                onClick={syncExpenses}
              >
                Sync now
              </Button>
            </CreateCallout.Warning>
          )}
      </Space>
    </Allocation>
  )
}
