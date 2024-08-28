import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { useJBContractContext } from 'juice-sdk-react'
import Link from 'next/link'
import { settingsPagePath, v4ProjectRoute } from 'packages/v4/utils/routes'
import { ReactNode } from 'react'
import { useChainId } from 'wagmi'

export function TransactionSuccessModal({
  open,
  onClose,
  content,
}: {
  open: boolean
  onClose: VoidFunction
  content: ReactNode
}) {
  const { projectId: projectIdBigInt } = useJBContractContext()
  const projectId = Number(projectIdBigInt)
  const chainId = useChainId()

  const checkIconWithBackground = (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-melon-100 dark:bg-melon-950">
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-melon-200 dark:bg-melon-900">
        <CheckCircleIcon className="h-10 w-10 text-melon-700 dark:text-melon-500" />
      </div>
    </div>
  )

  const buttonClasses = 'w-[185px] h-12'
  return (
    <Modal
      open={open}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="flex w-full flex-col items-center gap-4 pt-2 text-center">
        {checkIconWithBackground}
        {content}
        <div className="flex gap-2.5">
          <Link href={settingsPagePath({ projectId, chainId }, undefined)}>
            <Button type="ghost" className={buttonClasses}>
              <Trans>Back to settings</Trans>
            </Button>
          </Link>
          <Link href={v4ProjectRoute({ projectId, chainId })}>
            <Button type="primary" className={buttonClasses}>
              <Trans>Go to project</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  )
}
