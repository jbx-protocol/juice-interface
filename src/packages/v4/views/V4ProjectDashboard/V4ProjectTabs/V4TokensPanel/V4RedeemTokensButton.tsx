import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useNativeTokenSurplus } from 'juice-sdk-react'
import { useV4UserTotalTokensBalance } from 'packages/v4/contexts/V4UserTotalTokensBalanceProvider'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import React, { useCallback, useMemo, useState } from 'react'
import { V4BurnOrRedeemModal } from './V4BurnOrRedeemModal'

export const V4RedeemTokensButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const payoutLimitResult = usePayoutLimit()
  const payoutLimit = payoutLimitResult.data.amount ?? 0n
  const surplusResult = useNativeTokenSurplus()
  const surplus = surplusResult.data ?? 0n
  const userTokenBalance = useV4UserTotalTokensBalance().data ?? 0n

  const loading = React.useMemo(
    () => payoutLimitResult.isLoading && surplusResult.isLoading,
    [payoutLimitResult.isLoading, surplusResult.isLoading],
  )

  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const hasSurplus = React.useMemo(() => surplus > 0n, [surplus])

  const redeemTokensDisabled = useMemo(() => {
    if (!userTokenBalance || !hasSurplus || payoutLimit === MAX_PAYOUT_LIMIT)
      return true
    return userTokenBalance === 0n
  }, [hasSurplus, payoutLimit, userTokenBalance])

  const redeemDisabledTooltip = useMemo(() => {
    if (!userTokenBalance || userTokenBalance === 0n)
      return t`No tokens to cash out.`
    if (!hasSurplus)
      return t`This project has no ETH, or is using all of its ETH for payouts.`
    if (payoutLimit === 0n) return t`This project has redemptions turned off.`
    return undefined
  }, [hasSurplus, payoutLimit, userTokenBalance])

  return (
    <Tooltip
      title={redeemDisabledTooltip}
      open={redeemTokensDisabled && redeemDisabledTooltip ? undefined : false}
      className={containerClassName}
    >
      <Button
        type="primary"
        loading={loading}
        className={className}
        disabled={redeemTokensDisabled}
        onClick={redeemTokensDisabled ? undefined : openModal}
      >
        <Trans>Cash out tokens</Trans>
      </Button>
      <V4BurnOrRedeemModal
        open={open}
        onCancel={closeModal}
        onConfirmed={closeModal}
      />
    </Tooltip>
  )
}
