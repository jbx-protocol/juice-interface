import { t } from '@lingui/macro'
import moment from 'moment'
import { useAvailablePayoutsSelections } from 'packages/v2v3/components/Create/components/pages/PayoutsPage/hooks/useAvailablePayoutsSelections'
import { formatFundingCycleDuration } from 'packages/v2v3/components/Create/utils/formatFundingCycleDuration'
import { AllocationSplit } from 'packages/v2v3/components/shared/Allocation/Allocation'
import {
  allocationToSplit,
  splitToAllocation,
} from 'packages/v2v3/utils/splitToAllocation'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  useCreatingDistributionLimit,
  useCreatingPayoutSplits,
} from 'redux/hooks/v2v3/create'
import { DEFAULT_MUST_START_AT_OR_AFTER } from 'redux/slices/creatingV2Project'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'

export const useFundingConfigurationReview = () => {
  const { fundingCycleData, payoutsSelection, mustStartAtOrAfter } =
    useAppSelector(state => state.creatingV2Project)
  const [distributionLimit] = useCreatingDistributionLimit()
  const [payoutSplits, setPayoutSplits] = useCreatingPayoutSplits()

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
