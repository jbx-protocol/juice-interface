import { Button, Tooltip } from 'antd'
import { useCallback, useState } from 'react'

import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { JBChainId } from 'juice-sdk-react'
import { Trans } from '@lingui/macro'
import V4DistributeReservedTokensModal from './V4DistributeReservedTokensModal'
import { reloadWindow } from 'utils/windowUtils'
import { twMerge } from 'tailwind-merge'
import { useV4ReservedTokensSubPanel } from './hooks/useV4V5ReservedTokensSubPanel'

export const V4V5SendReservedTokensButton = ({
  className,
  containerClassName,
  chainId
}: {
  className?: string
  containerClassName?: string
  chainId: JBChainId | undefined
}) => {
  const { aggregatedPendingReservedTokens } = useV4ReservedTokensSubPanel()

  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const distributeButtonDisabled = aggregatedPendingReservedTokens === 0n
  if (!chainId) return null
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
      <V4V5DistributeReservedTokensModal
        open={open}
        onCancel={closeModal}
        onConfirmed={reloadWindow}
        chainId={chainId}
      />
    </Tooltip>
  )
}
