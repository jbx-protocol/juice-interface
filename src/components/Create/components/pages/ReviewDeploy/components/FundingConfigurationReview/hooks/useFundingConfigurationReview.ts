import { t } from '@lingui/macro'
import { useAvailablePayoutsSelections } from 'components/Create/components/pages/PayoutsPage/hooks/useAvailablePayoutsSelections'
import { formatFundingCycleDuration } from 'components/Create/utils/formatFundingCycleDuration'
import { AllocationSplit } from 'components/v2v3/shared/Allocation/Allocation'
import moment from 'moment'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/useEditingPayoutSplits'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/editingV2Project'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'

export const useFundingConfigurationReview = () => {
  const { fundingCycleData, payoutsSelection, mustStartAtOrAfter } =
    useAppSelector(state => state.editingV2Project)
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
        distributionLimitCurrency: distributionLimit?.currency,
      }),
    [distributionLimit?.amount, distributionLimit?.currency],
  )

  const availableSelections = useAvailablePayoutsSelections()
  const selection = useMemo(() => {
    const overrideSelection =
      availableSelections.size === 1 ? [...availableSelections][0] : undefined
    return overrideSelection || payoutsSelection
  }, [availableSelections, payoutsSelection])

  const launchDate = useMemo(
    () =>
      mustStartAtOrAfter &&
      mustStartAtOrAfter !== DEFAULT_MUST_START_AT_OR_AFTER &&
      !isNaN(parseFloat(mustStartAtOrAfter))
        ? moment.unix(parseFloat(mustStartAtOrAfter))
        : undefined,
    [mustStartAtOrAfter],
  )

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
    allocationSplits,
    setAllocationSplits,
    launchDate,
  }
}
