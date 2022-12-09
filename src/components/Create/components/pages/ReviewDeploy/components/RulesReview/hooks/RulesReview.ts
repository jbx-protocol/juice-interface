import { t } from '@lingui/macro'
import { useAvailableReconfigurationStrategies } from 'components/Create/components/pages/ReconfigurationRules'
import { readNetwork } from 'constants/networks'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'

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
    if (fundingCycleMetadata.pausePay) {
      return t`Yes`
    } else {
      return t`No`
    }
  }, [fundingCycleMetadata.pausePay])

  const terminalConfiguration = useMemo(() => {
    if (fundingCycleMetadata.global.allowSetTerminals) {
      return t`Yes`
    } else {
      return t`No`
    }
  }, [fundingCycleMetadata.global.allowSetTerminals])

  const strategy = useMemo(() => {
    return availableBallotStrategies.find(
      strategy => strategy.id === reconfigurationRuleSelection,
    )?.name
  }, [availableBallotStrategies, reconfigurationRuleSelection])

  const holdFees = useMemo(() => {
    if (fundingCycleMetadata.holdFees) {
      return t`Yes`
    } else {
      return t`No`
    }
  }, [fundingCycleMetadata.holdFees])

  const useDataSourceForRedeem = useMemo(() => {
    if (fundingCycleMetadata.useDataSourceForRedeem) {
      return t`Yes`
    } else {
      return t`No`
    }
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
