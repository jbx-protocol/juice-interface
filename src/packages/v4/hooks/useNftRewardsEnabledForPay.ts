import { JBRulesetContext, useJBProjectId, useJBRulesetContext, useJBUpcomingRuleset } from 'juice-sdk-react'

import React from 'react'
import { useV4NftRewards } from '../contexts/V4NftRewards/V4NftRewardsProvider'
import { zeroAddress } from 'viem'

type RulesetMetadata = JBRulesetContext['rulesetMetadata']['data']

export function useNftRewardsEnabledForPay() {
  const jbRuleset = useJBRulesetContext()
  const { projectId, chainId } = useJBProjectId()
  const { rulesetMetadata: upcomingRulesetMetadata } = useJBUpcomingRuleset({
    projectId, chainId
  })
  const { nftRewards } = useV4NftRewards()

  const hasNftRewards = React.useMemo(
    () => nftRewards.rewardTiers?.length !== 0,
    [nftRewards.rewardTiers],
  )

  let _effectiveRulesetMetadata: RulesetMetadata = jbRuleset.rulesetMetadata.data

  if (jbRuleset.ruleset?.data?.cycleNumber === 0) {
    _effectiveRulesetMetadata = upcomingRulesetMetadata
  }

  return hasNftRewards && hasDataSourceForPay(_effectiveRulesetMetadata)
}

const hasDataSourceForPay = (rulesetMetadata: RulesetMetadata) => {
  return (
    rulesetMetadata?.dataHook !== zeroAddress &&
    !!rulesetMetadata?.useDataHookForPay
  )
}
