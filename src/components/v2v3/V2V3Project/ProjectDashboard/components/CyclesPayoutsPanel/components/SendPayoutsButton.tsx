import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import DistributePayoutsModal from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/modals/DistributePayoutsModal'
import { useCallback, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useDistributableAmount } from '../hooks/useDistributableAmount'

export const SendPayoutsButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  const { distributableAmount } = useDistributableAmount()
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  const distributeButtonDisabled = useMemo(() => {
    return distributableAmount.eq(0)
  }, [distributableAmount])

  return (
    <Tooltip
      title={<Trans>No payouts remaining for this cycle.</Trans>}
      open={distributeButtonDisabled ? undefined : false}
      className={containerClassName}
    >
      <Button
        type="primary"
        className={twMerge('flex w-fit items-center gap-3', className)}
        onClick={openModal}
        disabled={distributeButtonDisabled}
      >
        <Trans>Send payouts</Trans>
        <ArrowUpCircleIcon className="h-5 w-5" />
      </Button>
      <DistributePayoutsModal
        open={open}
        onCancel={closeModal}
        onConfirmed={closeModal}
      />
    </Tooltip>
  )
}
