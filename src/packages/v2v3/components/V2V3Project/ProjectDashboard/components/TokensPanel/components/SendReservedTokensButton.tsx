import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectContext } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectContext'
import DistributeReservedTokensModal from 'packages/v2v3/components/V2V3Project/V2V3FundingCycleSection/modals/DistributeReservedTokensModal'
import { useProjectReservedTokens } from 'packages/v2v3/hooks/contractReader/ProjectReservedTokens'
import { useCallback, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { reloadWindow } from 'utils/windowUtils'

export const SendReservedTokensButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const { projectId } = useProjectMetadataContext()
  const { reservedRate } = useProjectContext().fundingCycleMetadata ?? {}
  const { data: reservedTokens, loading: loadingReservedTokens } =
    useProjectReservedTokens({
      projectId,
      reservedRate: reservedRate,
    })
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const distributeButtonDisabled = useMemo(() => {
    return (reservedTokens ?? BigInt(0)) === 0n
  }, [reservedTokens])

  return (
    <Tooltip
      title={<Trans>No reserved tokens to send.</Trans>}
      open={distributeButtonDisabled ? undefined : false}
      className={containerClassName}
    >
      <Button
        type="primary"
        className={twMerge('flex w-fit items-center gap-3', className)}
        loading={loadingReservedTokens}
        onClick={openModal}
        disabled={distributeButtonDisabled}
      >
        <Trans>Send reserved tokens</Trans>
        <ArrowUpCircleIcon className="h-5 w-5" />
      </Button>
      <DistributeReservedTokensModal
        open={open}
        onCancel={closeModal}
        onConfirmed={reloadWindow}
      />
    </Tooltip>
  )
}
