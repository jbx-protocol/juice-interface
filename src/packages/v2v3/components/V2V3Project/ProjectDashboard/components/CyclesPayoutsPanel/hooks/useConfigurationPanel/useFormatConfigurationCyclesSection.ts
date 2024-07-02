import { t } from '@lingui/macro'
import { timeSecondsToDateString } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/utils/timeSecondsToDateString'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3FundingCycle } from 'packages/v2v3/models/fundingCycle'
import { getBallotStrategyByAddress } from 'packages/v2v3/utils/ballotStrategies'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'
import { formatTime } from 'utils/format/formatTime'
import { ConfigurationPanelDatum } from '../../components/ConfigurationPanel'
import { pairToDatum } from '../../utils/pairToDatum'

export const useFormatConfigurationCyclesSection = ({
  fundingCycle,
  upcomingFundingCycle,
  distributionLimitAmountCurrency,
  upcomingDistributionLimitAmountCurrency,
}: {
  fundingCycle: V2V3FundingCycle | undefined
  upcomingFundingCycle?: V2V3FundingCycle | null
  distributionLimitAmountCurrency:
    | {
        distributionLimit: bigint | undefined
        currency: bigint | undefined
      }
    | undefined
  upcomingDistributionLimitAmountCurrency?: {
    distributionLimit: bigint | undefined
    currency: bigint | undefined
  } | null
}) => {
  const durationDatum: ConfigurationPanelDatum = useMemo(() => {
    const formatDuration = (duration: bigint | undefined) => {
      if (duration === undefined) return undefined
      if (duration === 0n) return t`Not set`
      return timeSecondsToDateString(Number(duration), 'short', 'lower')
    }
    const currentDuration = formatDuration(fundingCycle?.duration)
    if (upcomingFundingCycle === null) {
      return pairToDatum(t`Duration`, currentDuration, null)
    }
    const upcomingDuration = formatDuration(upcomingFundingCycle?.duration)

    return pairToDatum(t`Duration`, currentDuration, upcomingDuration)
  }, [fundingCycle?.duration, upcomingFundingCycle])

  const startTimeDatum: ConfigurationPanelDatum = useMemo(() => {
    const formattedTime =
      upcomingFundingCycle === null
        ? formatTime(fundingCycle?.start)
        : fundingCycle?.duration === 0n
        ? t`Any time`
        : formatTime(
            fundingCycle
              ? fundingCycle.start + fundingCycle.duration
              : undefined,
          )

    const formatTimeDatum: ConfigurationPanelDatum = {
      name: t`Start time`,
      new: formattedTime,
      easyCopy: true,
    }
    return formatTimeDatum
  }, [upcomingFundingCycle, fundingCycle])

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const formatCurrency = (currency: bigint | undefined) => {
      if (currency === undefined) return undefined
      return Number(currency) as V2V3CurrencyOption
    }
    const formatAmountWad = (
      amountWad: bigint | undefined,
      currency: V2V3CurrencyOption | undefined,
    ) => {
      if (amountWad === undefined) return undefined
      if (amountWad === MAX_DISTRIBUTION_LIMIT) return t`Unlimited`
      if (amountWad === 0n) return t`Zero (no payouts)`
      return formatCurrencyAmount({
        amount: Number(fromWad(amountWad)),
        currency,
      })
    }
    const { distributionLimit, currency } =
      distributionLimitAmountCurrency ?? {}
    const currentPayout = formatAmountWad(
      distributionLimit,
      formatCurrency(currency),
    )

    if (upcomingDistributionLimitAmountCurrency === null) {
      return pairToDatum(t`Payouts`, currentPayout, null)
    }

    const upcomingDistributionLimit =
      upcomingDistributionLimitAmountCurrency?.distributionLimit !== undefined
        ? upcomingDistributionLimitAmountCurrency.distributionLimit
        : undefined
    const upcomingDistributionLimitCurrency =
      upcomingDistributionLimitAmountCurrency?.currency !== undefined
        ? upcomingDistributionLimitAmountCurrency.currency
        : undefined
    const upcomingPayout = formatAmountWad(
      upcomingDistributionLimit,
      formatCurrency(upcomingDistributionLimitCurrency),
    )

    return pairToDatum(t`Payouts`, currentPayout, upcomingPayout)
  }, [distributionLimitAmountCurrency, upcomingDistributionLimitAmountCurrency])

  const editDeadlineDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentBallotStrategy = fundingCycle?.ballot
      ? getBallotStrategyByAddress(fundingCycle.ballot)
      : undefined
    const current = currentBallotStrategy?.name
    if (upcomingFundingCycle === null) {
      return pairToDatum(t`Edit deadline`, current, null)
    }

    const upcomingBallotStrategy = upcomingFundingCycle?.ballot
      ? getBallotStrategyByAddress(upcomingFundingCycle.ballot)
      : undefined
    const upcoming = upcomingBallotStrategy?.name
    return pairToDatum(t`Edit deadline`, current, upcoming)
  }, [fundingCycle?.ballot, upcomingFundingCycle])

  return useMemo(() => {
    return {
      duration: durationDatum,
      startTime: startTimeDatum,
      payouts: payoutsDatum,
      editDeadline: editDeadlineDatum,
    }
  }, [durationDatum, startTimeDatum, editDeadlineDatum, payoutsDatum])
}
