import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import {
  useProjectContext,
  useProjectMetadata,
} from 'components/ProjectDashboard/hooks'
import DistributeReservedTokensModal from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/modals/DistributeReservedTokensModal'
import { BigNumber } from 'ethers'
import { useProjectReservedTokens } from 'hooks/v2v3/contractReader/ProjectReservedTokens'
import { useCallback, useMemo, useState } from 'react'
import { reloadWindow } from 'utils/windowUtils'

export const SendReservedTokensButton = ({
  className,
}: {
  className?: string
}) => {
  const { projectId } = useProjectMetadata()
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
    return (reservedTokens ?? BigNumber.from(0)).eq(0)
  }, [reservedTokens])

  return (
    <Tooltip
      title={<Trans>No reserved tokens to send.</Trans>}
      open={distributeButtonDisabled ? undefined : false}
      className={className}
    >
      <Button
        type="primary"
        className="flex w-fit items-center gap-3"
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
