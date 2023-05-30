import { t } from '@lingui/macro'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import { timeSecondsToDateString } from 'components/ProjectDashboard/utils/timeSecondsToDateString'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useProjectUpcomingFundingCycle } from 'hooks/v2v3/contractReader/useProjectUpcomingFundingCycle'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useMemo } from 'react'
import { fromWad } from 'utils/format/formatNumber'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import {
  ConfigurationPanelDatum,
  ConfigurationPanelTableData,
} from '../../components/ConfigurationPanel'
import { pairToDatum } from '../../utils/pairToDatum'

export const useCycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { projectId } = useProjectMetadata()

  const {
    fundingCycle,
    distributionLimit,
    distributionLimitCurrency,
    primaryETHTerminal,
  } = useProjectContext()
  const { data: upcomingFundingCycleData } = useProjectUpcomingFundingCycle({
    projectId,
  })
  const [upcomingFundingCycle] = upcomingFundingCycleData ?? []

  const { data: upcomingDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: upcomingFundingCycle?.configuration.toString(),
    terminal: primaryETHTerminal,
  })
  const [upcomingDistributionLimit, upcomingDistributionLimitCurrency] =
    upcomingDistributionLimitData ?? []

  const durationDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentDuration = fundingCycle?.duration
      ? timeSecondsToDateString(
          fundingCycle.duration.toNumber(),
          'short',
          'lower',
        )
      : undefined
    const upcomingDuration = upcomingFundingCycle?.duration
      ? timeSecondsToDateString(
          upcomingFundingCycle.duration.toNumber(),
          'short',
          'lower',
        )
      : undefined

    return pairToDatum(t`Duration`, type, currentDuration, upcomingDuration)
  }, [fundingCycle?.duration, type, upcomingFundingCycle?.duration])

  const payoutsDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentCurrency = distributionLimitCurrency
      ? (distributionLimitCurrency.toNumber() as V2V3CurrencyOption)
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

    return pairToDatum(t`Payouts`, type, currentPayout, upcomingPayout)
  }, [
    distributionLimit,
    distributionLimitCurrency,
    type,
    upcomingDistributionLimit,
    upcomingDistributionLimitCurrency,
  ])

  const editDeadlineDatum: ConfigurationPanelDatum = useMemo(() => {
    const currentBallotStrategy = fundingCycle?.ballot
      ? getBallotStrategyByAddress(fundingCycle.ballot)
      : undefined
    const upcomingBallotStrategy = upcomingFundingCycle?.ballot
      ? getBallotStrategyByAddress(upcomingFundingCycle.ballot)
      : undefined
    return pairToDatum(
      t`Edit deadline`,
      type,
      currentBallotStrategy?.name,
      upcomingBallotStrategy?.name,
    )
  }, [fundingCycle?.ballot, type, upcomingFundingCycle?.ballot])

  return useMemo(() => {
    return {
      duration: durationDatum,
      payouts: payoutsDatum,
      editDeadline: editDeadlineDatum,
    }
  }, [durationDatum, editDeadlineDatum, payoutsDatum])
}
