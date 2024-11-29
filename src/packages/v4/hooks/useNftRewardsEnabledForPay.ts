import { JBRulesetContext, useJBRulesetContext } from 'juice-sdk-react'
import React from 'react'
import { zeroAddress } from 'viem'
import { useV4NftRewards } from '../contexts/V4NftRewards/V4NftRewardsProvider'

type RulesetMetadata = JBRulesetContext['rulesetMetadata']['data']

export function useNftRewardsEnabledForPay() {
  const jbRuleset = useJBRulesetContext()
  const { nftRewards } = useV4NftRewards()

  const hasNftRewards = React.useMemo(
    () => nftRewards.rewardTiers?.length !== 0,
    [nftRewards.rewardTiers],
  )

  return hasNftRewards && hasDataSourceForPay(jbRuleset.rulesetMetadata.data)
}

const hasDataSourceForPay = (rulesetMetadata: RulesetMetadata) => {
  return (
    rulesetMetadata?.dataHook !== zeroAddress &&
    !!rulesetMetadata?.useDataHookForPay
  )
}
