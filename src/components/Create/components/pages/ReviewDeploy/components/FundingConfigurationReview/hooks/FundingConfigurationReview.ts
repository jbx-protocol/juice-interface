import { t } from '@lingui/macro'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { useAvailablePayoutsSelections } from 'components/Create/components/pages/Payouts/hooks'
import { formatFundingCycleDuration } from 'components/Create/utils/formatFundingCycleDuration'
import { formatFundingTarget } from 'components/Create/utils/formatFundingTarget'
import {
  allocationToSplit,
  splitToAllocation,
} from 'components/Create/utils/splitToAllocation'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'

export const useFundingConfigurationReview = () => {
  const { fundingCycleData, payoutsSelection } = useAppSelector(
    state => state.editingV2Project,
  )
  const [distributionLimit] = useEditingDistributionLimit()
  const [payoutSplits, setPayoutSplits] = useEditingPayoutSplits()

  const fundingCycles = useMemo(
    () => (fundingCycleData.duration == '0' ? t`Manual` : t`Automated`),
    [fundingCycleData.duration],
  )

  const duration = useMemo(
    () => formatFundingCycleDuration(fundingCycleData.duration),
    [fundingCycleData.duration],
  )

  const fundingTarget = useMemo(
    () =>
      formatFundingTarget({
        distributionLimitWad: distributionLimit?.amount,
        distributionLimitCurrency: distributionLimit?.currency.toString(),
      }),
    [distributionLimit?.amount, distributionLimit?.currency],
  )

  const availableSelections = useAvailablePayoutsSelections()
  const selection = useMemo(() => {
    const overrideSelection =
      availableSelections.size === 1 ? [...availableSelections][0] : undefined
    return overrideSelection || payoutsSelection
  }, [availableSelections, payoutsSelection])

  const payoutsText = useMemo(() => {
    return selection === 'amounts' ? t`Amounts` : t`Percentages`
  }, [selection])

  const allocationSplits = useMemo(
    () => payoutSplits.map(splitToAllocation),
    [payoutSplits],
  )
  const setAllocationSplits = useCallback(
    (allocations: AllocationSplit[]) =>
      setPayoutSplits(allocations.map(allocationToSplit)),
    [setPayoutSplits],
  )

  return {
    selection,
    fundingCycles,
    duration,
    fundingTarget,
    payoutsText,
    allocationSplits,
    setAllocationSplits,
  }
}
