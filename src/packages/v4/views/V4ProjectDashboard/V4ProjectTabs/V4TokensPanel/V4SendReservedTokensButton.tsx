import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useJBContractContext, useReadJbTokensTotalCreditSupplyOf } from 'juice-sdk-react'
import { useCallback, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { reloadWindow } from 'utils/windowUtils'
import V4DistributeReservedTokensModal from './V4DistributeReservedTokensModal'

export const V4SendReservedTokensButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const { projectId } = useJBContractContext()
  const { data: totalCreditSupply, isLoading: totalCreditSupplyLoading } = useReadJbTokensTotalCreditSupplyOf({
    args: [projectId],
  })
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const distributeButtonDisabled = useMemo(() => {
    return (totalCreditSupply ?? 0n) === 0n
  }, [totalCreditSupply])

  return (
    <Tooltip
      title={<Trans>No reserved tokens to send.</Trans>}
      open={distributeButtonDisabled ? undefined : false}
      className={containerClassName}
    >
      <Button
        type="primary"
        className={twMerge('flex w-fit items-center gap-3', className)}
        loading={totalCreditSupplyLoading}
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
