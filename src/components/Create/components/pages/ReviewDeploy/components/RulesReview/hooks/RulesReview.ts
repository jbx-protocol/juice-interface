import { useAvailableReconfigurationStrategies } from 'components/Create/hooks/AvailableReconfigurationStrategies'
import { readNetwork } from 'constants/networks'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'
import { formatBoolean, formatPaused } from 'utils/format/formatBoolean'

export const useRulesReview = () => {
  const availableBallotStrategies = useAvailableReconfigurationStrategies(
    readNetwork.name,
  )
  const {
    fundingCycleData: { ballot: customAddress },
    reconfigurationRuleSelection,
    fundingCycleMetadata,
  } = useAppSelector(state => state.editingV2Project)

  const pausePayments = useMemo(() => {
    return formatPaused(fundingCycleMetadata.pausePay)
  }, [fundingCycleMetadata.pausePay])

  const terminalConfiguration = useMemo(() => {
    return formatBoolean(fundingCycleMetadata.global.allowSetTerminals)
  }, [fundingCycleMetadata.global.allowSetTerminals])

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

  return {
    customAddress,
    pausePayments,
    terminalConfiguration,
    strategy,
    holdFees,
    useDataSourceForRedeem,
  }
}
