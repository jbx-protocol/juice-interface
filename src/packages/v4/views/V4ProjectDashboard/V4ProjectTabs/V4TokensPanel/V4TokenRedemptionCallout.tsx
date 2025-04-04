import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useJBRulesetContext } from 'juice-sdk-react'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import React, { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

export const V4TokenRedemptionCallout = () => {
  const rulesetMetadata = useJBRulesetContext().rulesetMetadata.data
  const payoutLimit = usePayoutLimit()

  const redemptionEnabled = React.useMemo(() => {
    if (!rulesetMetadata || payoutLimit.isLoading) return
    // TODO: Update cashOutTaxRate to be cashOut
    return (
      rulesetMetadata.cashOutTaxRate.value > 0 &&
      payoutLimit.data.amount !== MAX_PAYOUT_LIMIT
    )
  }, [payoutLimit.data.amount, payoutLimit.isLoading, rulesetMetadata])

  const loading = useMemo(
    () => redemptionEnabled === undefined,
    [redemptionEnabled],
  )

  const text = t`This cycle has token redemptions ${
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
