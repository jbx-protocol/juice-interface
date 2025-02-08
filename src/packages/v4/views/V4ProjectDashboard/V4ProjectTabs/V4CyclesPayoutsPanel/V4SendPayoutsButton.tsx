import { Button, Tooltip } from 'antd'
import { useCallback, useState } from 'react'

import { ArrowUpCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { twMerge } from 'tailwind-merge'
import V4DistributePayoutsModal from './V4DistributePayoutsModal'

export const V4SendPayoutsButton = ({
  className,
  containerClassName,
}: {
  className?: string
  containerClassName?: string
}) => {
  // const { distributableAmount } = useV4DistributableAmount()
  const [open, setOpen] = useState(false)
  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  // v4TODO: aggregate distributable amount 
  // const distributeButtonDisabled = useMemo(() => {
  //   return distributableAmount.value === 0n
  // }, [distributableAmount])

  return (
    <Tooltip
      title={<Trans>No payouts remaining for this cycle.</Trans>}
      // open={distributeButtonDisabled ? undefined : false}
      className={containerClassName}
    >
      <Button
        type="primary"
        className={twMerge('flex w-fit items-center gap-3', className)}
        onClick={openModal}
        // disabled={distributeButtonDisabled}
      >
        <Trans>Send payouts</Trans>
        <ArrowUpCircleIcon className="h-5 w-5" />
      </Button>
      <V4DistributePayoutsModal
        open={open}
        onCancel={closeModal}
        onConfirmed={closeModal}
      />
    </Tooltip>
  )
}
