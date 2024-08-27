import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { reloadWindow } from 'utils/windowUtils'
import V4DistributeReservedTokensModal from './V4DistributeReservedTokensModal'
import { useV4ReservedTokensSubPanel } from './hooks/useV4ReservedTokensSubPanel'

export const V4SendReservedTokensButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const { pendingReservedTokens } = useV4ReservedTokensSubPanel()

  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const distributeButtonDisabled =
    !pendingReservedTokens || pendingReservedTokens === 0n

  return (
    <Tooltip
      title={<Trans>No reserved tokens to send.</Trans>}
      open={distributeButtonDisabled ? undefined : false}
      className={containerClassName}
    >
      <Button
        type="primary"
        className={twMerge('flex w-fit items-center gap-3', className)}
        onClick={openModal}
        disabled={distributeButtonDisabled}
      >
        <Trans>Send reserved tokens</Trans>
        <ArrowUpCircleIcon className="h-5 w-5" />
      </Button>
      <V4DistributeReservedTokensModal
        open={open}
        onCancel={closeModal}
        onConfirmed={reloadWindow}
      />
    </Tooltip>
  )
}
