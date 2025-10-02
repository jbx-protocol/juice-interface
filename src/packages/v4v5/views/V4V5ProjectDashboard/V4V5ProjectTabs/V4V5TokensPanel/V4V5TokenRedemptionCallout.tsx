import React, { useMemo } from 'react'
import { useJBProjectId, useJBRulesetContext, useJBUpcomingRuleset } from 'juice-sdk-react'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { MAX_PAYOUT_LIMIT } from 'packages/v4v5/utils/math'
import { t } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import { usePayoutLimit } from 'packages/v4v5/hooks/usePayoutLimit'

export const V4V5TokenRedemptionCallout = () => {
  const { rulesetMetadata: currentRulesetMetadata, ruleset } = useJBRulesetContext()
  const { projectId, chainId } = useJBProjectId()
  const { 
    rulesetMetadata: upcomingRulesetMetadata, 
  } = useJBUpcomingRuleset({ projectId, chainId })

  let _rulesetMetadata = currentRulesetMetadata.data

  if (ruleset.data?.cycleNumber === 0) {
    _rulesetMetadata = upcomingRulesetMetadata
  }
  const payoutLimit = usePayoutLimit()

  const redemptionEnabled = React.useMemo(() => {
    if (!_rulesetMetadata || payoutLimit.isLoading) return
    return (
      _rulesetMetadata.cashOutTaxRate.value < 100 &&
      payoutLimit.data.amount !== MAX_PAYOUT_LIMIT
    )
  }, [payoutLimit.data.amount, payoutLimit.isLoading, _rulesetMetadata])

  const loading = useMemo(
    () => redemptionEnabled === undefined,
    [redemptionEnabled],
  )

  const text = t`This cycle has token cash outs ${
    redemptionEnabled ? 'enabled' : 'disabled'
  }`

  if (loading) return null

  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-lg py-2 px-3.5 text-sm font-medium shadow-sm',
        redemptionEnabled
          ? 'border-bluebs-100 bg-bluebs-25 text-bluebs-700 dark:border-bluebs-800 dark:bg-bluebs-950 dark:text-bluebs-400'
          : 'bg-split-50 text-split-800 dark:bg-split-950 dark:text-split-300',
      )}
    >
      <InformationCircleIcon className="h-5 w-5" />
      {text}
    </div>
  )
}
