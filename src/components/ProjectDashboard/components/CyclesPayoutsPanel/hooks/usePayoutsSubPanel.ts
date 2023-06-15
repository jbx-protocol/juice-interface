import assert from 'assert'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { ETH_PAYOUT_SPLIT_GROUP } from 'constants/splits'
import { BigNumber } from 'ethers'
import useProjectSplits from 'hooks/v2v3/contractReader/useProjectSplits'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { Split } from 'models/splits'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { isJuiceboxProjectSplit } from 'utils/v2v3/distributions'
import {
  MAX_DISTRIBUTION_LIMIT,
  SPLITS_TOTAL_PERCENT,
  feeForAmount,
  formatSplitPercent,
} from 'utils/v2v3/math'

const splitHasFee = (split: Split) => {
  return !isJuiceboxProjectSplit(split)
}

const calculateSplitAmountWad = (
  split: Split,
  distributionLimit: BigNumber | undefined,
  primaryETHTerminalFee: BigNumber | undefined,
) => {
  const splitValue = distributionLimit
    ?.mul(split.percent)
    .div(SPLITS_TOTAL_PERCENT)
  const feeAmount = splitHasFee(split)
    ? feeForAmount(splitValue, primaryETHTerminalFee) ?? BigNumber.from(0)
    : BigNumber.from(0)
  return splitValue?.sub(feeAmount)
}

export const usePayoutsSubPanel = (type: 'current' | 'upcoming') => {
  const { projectId } = useProjectMetadata()
  const {
    payoutSplits: currentPayoutSplits,
    distributionLimit: currentDistributionLimit,
    distributionLimitCurrency: currentDistributionLimitCurrency,
    primaryETHTerminalFee,
  } = useProjectContext()

  const {
    data: upcomingFundingCycleData,
    loading: upcomingFundingCycleLoading,
  } = useProjectUpcomingFundingCycle({ projectId })
  const [upcomingFundingCycle] = upcomingFundingCycleData ?? []

  const { data: upcomingPayoutSplits, loading: upcomingProjectSplitsLoading } =
    useProjectSplits({
      projectId,
      splitGroup: ETH_PAYOUT_SPLIT_GROUP,
      domain: upcomingFundingCycle?.configuration?.toString(),
    })

  const showAmountOnPayout = useMemo(() => {
    if (currentDistributionLimit?.eq(MAX_DISTRIBUTION_LIMIT)) return false
    if (currentDistributionLimit?.eq(0)) return false
    return true
  }, [currentDistributionLimit])

  const transformSplit = useCallback(
    (split: Split) => {
      assert(split.beneficiary, 'Beneficiary must be defined')
      let amount = undefined
      const splitAmountWad = calculateSplitAmountWad(
        split,
        currentDistributionLimit,
        primaryETHTerminalFee,
      )
      if (
        showAmountOnPayout &&
        splitAmountWad &&
        currentDistributionLimitCurrency
      ) {
        amount = formatCurrencyAmount({
          amount: Number(fromWad(splitAmountWad)),
          currency:
            currentDistributionLimitCurrency.toNumber() as V2V3CurrencyOption,
        })
      }
      return {
        projectId: split.projectId
          ? BigNumber.from(split.projectId).toNumber()
          : undefined,
        address: split.beneficiary!,
        percent: `${formatSplitPercent(BigNumber.from(split.percent))}%`,
        amount,
      }
    },
    [
      currentDistributionLimit,
      currentDistributionLimitCurrency,
      primaryETHTerminalFee,
      showAmountOnPayout,
    ],
  )

  const payouts = useMemo(() => {
    if (type === 'current') {
      if (!currentPayoutSplits) return undefined
      return currentPayoutSplits
        .sort((a, b) => Number(b.percent) - Number(a.percent))
        .map(transformSplit)
    }
    if (type === 'upcoming') {
      if (!upcomingPayoutSplits) return undefined
      return upcomingPayoutSplits
        .sort((a, b) => Number(b.percent) - Number(a.percent))
        .map(transformSplit)
    }
  }, [currentPayoutSplits, transformSplit, type, upcomingPayoutSplits])

  if (
    type === 'upcoming' &&
    (upcomingFundingCycleLoading || upcomingProjectSplitsLoading)
  ) {
    return {
      loading: true,
    }
  }

  return {
    loading: false,
    payouts,
  }
}
