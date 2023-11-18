import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useProjectContext } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import { useUserTokenBalanceWad } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useUserTokenBalanceWad'
import { V2V3BurnOrRedeemModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3BurnOrRedeemModal'
import { useCallback, useMemo, useState } from 'react'

export const RedeemTokensButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const { primaryTerminalCurrentOverflow, fundingCycleMetadata } =
    useProjectContext()
  const { data: userTokenBalanceWad, loading } = useUserTokenBalanceWad()
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const hasOverflow = useMemo(
    () => !!primaryTerminalCurrentOverflow?.gt(0),
    [primaryTerminalCurrentOverflow],
  )

  const redeemTokensDisabled = useMemo(() => {
    if (
      !userTokenBalanceWad ||
      !hasOverflow ||
      fundingCycleMetadata?.redemptionRate.eq(0)
    )
      return true
    return userTokenBalanceWad.isZero()
  }, [fundingCycleMetadata?.redemptionRate, hasOverflow, userTokenBalanceWad])

  const redeemDisabledTooltip = useMemo(() => {
    if (!userTokenBalanceWad || userTokenBalanceWad.eq(0))
      return t`No tokens to redeem.`
    if (!hasOverflow)
      return t`This project has no ETH, or is using all of its ETH for payouts.`
    if (fundingCycleMetadata?.redemptionRate.eq(0))
      return t`This project has redemptions turned off.`
    return undefined
  }, [fundingCycleMetadata?.redemptionRate, hasOverflow, userTokenBalanceWad])

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
        <Trans>Redeem tokens</Trans>
      </Button>
      <V2V3BurnOrRedeemModal
        open={open}
        onCancel={closeModal}
        onConfirmed={closeModal}
      />
    </Tooltip>
  )
}
