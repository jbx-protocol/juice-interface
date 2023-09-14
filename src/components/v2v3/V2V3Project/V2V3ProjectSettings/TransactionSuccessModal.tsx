import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import Link from 'next/link'
import { ReactNode, useContext } from 'react'
import { settingsPagePath, v2v3ProjectRoute } from 'utils/routes'

export function TransactionSuccessModal({
  open,
  onClose,
  content,
}: {
  open: boolean
  onClose: VoidFunction
  content: ReactNode
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { handle } = useContext(V2V3ProjectContext)

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
          <Link href={settingsPagePath(undefined, { projectId, handle })}>
            <Button type="ghost" className={buttonClasses}>
              <Trans>Back to settings</Trans>
            </Button>
          </Link>
          <Link href={v2v3ProjectRoute({ projectId, handle })}>
            <Button type="primary" className={buttonClasses}>
              <Trans>Go to project</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  )
}
