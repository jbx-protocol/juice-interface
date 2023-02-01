import { useAvailableReconfigurationStrategies } from 'components/Create/hooks/AvailableReconfigurationStrategies'
import { readNetwork } from 'constants/networks'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'
import { formatBoolean } from 'utils/format/formatBoolean'

export const useRulesReview = () => {
  const availableBallotStrategies = useAvailableReconfigurationStrategies(
    readNetwork.name,
  )
  const {
    fundingCycleData: { ballot: customAddress },
    reconfigurationRuleSelection,
    nftRewards: { flags: nftRewardsFlags },
    fundingCycleMetadata,
  } = useAppSelector(state => state.editingV2Project)

  const pausePayments = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.pausePay)
  }, [fundingCycleMetadata.pausePay])

  const terminalConfiguration = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.global.allowSetTerminals)
  }, [fundingCycleMetadata.global.allowSetTerminals])

  const pauseTransfers = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.global.pauseTransfers)
  }, [fundingCycleMetadata.global.pauseTransfers])

  const strategy = useMemo(() => {
    return availableBallotStrategies.find(
      strategy => strategy.id === reconfigurationRuleSelection,
    )?.name
  }, [availableBallotStrategies, reconfigurationRuleSelection])

  const holdFees = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.holdFees)
  }, [fundingCycleMetadata.holdFees])

  const useDataSourceForRedeem = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.useDataSourceForRedeem)
  }, [fundingCycleMetadata.useDataSourceForRedeem])

  const preventOverspending = useMemo(() => {
    if (nftRewardsFlags.preventOverspending) {
      return t`Yes`
    } else {
      return t`No`
    }
  }, [nftRewardsFlags.preventOverspending])

  return {
    customAddress,
    pausePayments,
    terminalConfiguration,
    pauseTransfers,
    strategy,
    holdFees,
    useDataSourceForRedeem,
    preventOverspending,
  }
}
