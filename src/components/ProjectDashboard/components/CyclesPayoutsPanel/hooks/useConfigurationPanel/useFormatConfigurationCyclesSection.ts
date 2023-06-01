import { t } from '@lingui/macro'
import { timeSecondsToDateString } from 'components/ProjectDashboard/utils/timeSecondsToDateString'
import { BigNumber } from 'ethers'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'
import { useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
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
    const currentDuration = fundingCycle?.duration
      ? timeSecondsToDateString(
          fundingCycle.duration.toNumber(),
          'short',
          'lower',
        )
      : undefined
    if (upcomingFundingCycle === null) {
      return pairToDatum(t`Duration`, currentDuration, null)
    }
    const upcomingDuration =
      upcomingFundingCycle?.duration !== undefined
        ? timeSecondsToDateString(
            upcomingFundingCycle.duration.toNumber(),
            'short',
            'lower',
          )
        : undefined

    return pairToDatum(t`Duration`, currentDuration, upcomingDuration)
  }, [fundingCycle?.duration, upcomingFundingCycle])

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const { distributionLimit, currency } =
      distributionLimitAmountCurrency ?? {}
    const currentCurrency = currency
      ? (currency?.toNumber() as V2V3CurrencyOption)
      : undefined
    const currentAmount = distributionLimit
      ? fromWad(distributionLimit)
      : undefined
    const currentPayout = currentAmount
      ? formatCurrencyAmount({
          amount: Number(currentAmount),
          currency: currentCurrency,
        })
      : undefined
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
    const upcomingCurrency = upcomingDistributionLimitCurrency
      ? (upcomingDistributionLimitCurrency.toNumber() as V2V3CurrencyOption)
      : undefined
    const upcomingAmount = upcomingDistributionLimit
      ? fromWad(upcomingDistributionLimit)
      : undefined
    const upcomingPayout = upcomingAmount
      ? formatCurrencyAmount({
          amount: Number(upcomingAmount),
          currency: upcomingCurrency,
        })
      : undefined

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
      payouts: payoutsDatum,
      editDeadline: editDeadlineDatum,
    }
  }, [durationDatum, editDeadlineDatum, payoutsDatum])
}
