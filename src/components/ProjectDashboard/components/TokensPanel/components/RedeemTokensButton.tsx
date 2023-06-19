import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useUserTokenBalanceWad } from 'components/ProjectDashboard/hooks/useUserTokenBalanceWad'
import { V2V3BurnOrRedeemModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/AccountBalanceDescription/V2V3BurnOrRedeemModal'
import { useCallback, useMemo, useState } from 'react'

export const RedeemTokensButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const { data: userTokenBalanceWad, loading } = useUserTokenBalanceWad()
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const redeemTokensDisabled = useMemo(() => {
    if (!userTokenBalanceWad) return true
    return userTokenBalanceWad.isZero()
  }, [userTokenBalanceWad])

  return (
    <Tooltip
      title={t`No tokens to redeem.`}
      open={redeemTokensDisabled ? undefined : false}
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
