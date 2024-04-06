import { t } from '@lingui/macro'
import { timeSecondsToDateString } from 'components/v2v3/V2V3Project/ProjectDashboard/utils/timeSecondsToDateString'
import { BigNumber } from 'ethers'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'
import { useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'
import { formatTime } from 'utils/format/formatTime'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
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
        distributionLimit: BigNumber | undefined
        currency: BigNumber | undefined
      }
    | undefined
  upcomingDistributionLimitAmountCurrency?: {
    distributionLimit: BigNumber | undefined
    currency: BigNumber | undefined
  } | null
}) => {
  const durationDatum: ConfigurationPanelDatum = useMemo(() => {
    const formatDuration = (duration: BigNumber | undefined) => {
      if (duration === undefined) return undefined
      if (duration.eq(0)) return t`Not set`
      return timeSecondsToDateString(duration.toNumber(), 'short', 'lower')
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
        : fundingCycle?.duration.isZero()
        ? t`Any time`
        : formatTime(fundingCycle?.start.add(fundingCycle?.duration))

    const formatTimeDatum: ConfigurationPanelDatum = {
      name: t`Start time`,
      new: formattedTime,
      easyCopy: true,
    }
    return formatTimeDatum
  }, [fundingCycle?.start, fundingCycle?.duration, upcomingFundingCycle])

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const formatCurrency = (currency: BigNumber | undefined) => {
      if (currency === undefined) return undefined
      return currency.toNumber() as V2V3CurrencyOption
    }
    const formatAmountWad = (
      amountWad: BigNumber | undefined,
      currency: V2V3CurrencyOption | undefined,
    ) => {
      if (amountWad === undefined) return undefined
      if (amountWad.eq(MAX_DISTRIBUTION_LIMIT)) return t`Unlimited`
      if (amountWad.eq(0)) return t`Zero (no payouts)`
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
