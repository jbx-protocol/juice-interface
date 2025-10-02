import { ConfigurationPanelTableData } from 'components/Project/ProjectTabs/CyclesPayoutsTab/ConfigurationPanel'
import { useJBRulesetByChain } from 'packages/v4v5/hooks/useJBRulesetByChain'
import { useJBUpcomingRuleset } from 'packages/v4v5/hooks/useJBUpcomingRuleset'
import { usePayoutLimit } from 'packages/v4v5/hooks/usePayoutLimit'
import { useUpcomingPayoutLimit } from 'packages/v4v5/hooks/useUpcomingPayoutLimit'
import { useCyclesPanelSelectedChain } from '../contexts/CyclesPanelSelectedChainContext'
import { useV4V5FormatConfigurationCycleSection } from './useV4V5FormatConfigurationCycleSection'

export const useV4V5CycleSection = (
  type: 'current' | 'upcoming',
): ConfigurationPanelTableData => {
  const { selectedChainId } = useCyclesPanelSelectedChain()

  const { ruleset } = useJBRulesetByChain(selectedChainId)
  
  const { ruleset: upcomingRuleset, isLoading: upcomingRulesetLoading } = useJBUpcomingRuleset(selectedChainId)

  const { data: payoutLimits } = usePayoutLimit()
  const payoutLimitAmount = payoutLimits?.amount
  const payoutLimitCurrency = payoutLimits?.currency

  const { data: upcomingPayoutLimit, isLoading: upcomingPayoutLimitLoading } = useUpcomingPayoutLimit()
  const upcomingPayoutLimitAmount = upcomingPayoutLimit?.amount
  const upcomingPayoutLimitCurrency = upcomingPayoutLimit?.currency
  
  return useV4V5FormatConfigurationCycleSection({
    ruleset,
    payoutLimitAmountCurrency: {
      amount: payoutLimitAmount,
      currency: payoutLimitCurrency,
    },
    upcomingRulesetLoading,
    upcomingPayoutLimitLoading,
    upcomingRuleset,
    upcomingPayoutLimitAmountCurrency: {
      amount: upcomingPayoutLimitAmount,
      currency: upcomingPayoutLimitCurrency,
    },

    // Hide upcoming info from current section.
    ...(type === 'current' && {
      upcomingRuleset: null,
      upcomingPayoutLimitAmountCurrency: null,
    }),
  })
}
