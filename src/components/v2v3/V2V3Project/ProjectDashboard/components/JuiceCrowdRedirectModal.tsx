import { Trans } from '@lingui/macro'
import { Button, Modal } from 'antd'
import { getJuicecrowdUrl } from 'components/DomainBadge'
import ExternalLink from 'components/ExternalLink'
import Image from 'next/image'
import { useState } from 'react'
import { useProjectMetadata } from '../hooks/useProjectMetadata'

export function JuiceCrowdRedirectModal() {
  const { projectMetadata, projectId } = useProjectMetadata()

  const isJuiceCrowd = projectMetadata?.domain === 'juicecrowd'
  const [open, setOpen] = useState<boolean>(isJuiceCrowd)

  if (!projectId) return null

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-bluebs-50 dark:bg-bluebs-900">
          <Image
            src="/assets/images/juicecrowd-logo.webp"
            alt="JuiceCrowd logo"
            height={35}
            width={35}
          />
        </div>
        <div className="text-xl font-medium">
          <Trans>It looks like this is a JuiceCrowd project.</Trans>
        </div>
        <p className="text-base">
          <Trans>
            Some functionality may not work on juicebox.money, check it out on
            Juicecrowd for the full experience.
          </Trans>
        </p>
      </div>
      <div className="-mb-4 flex w-full flex-col gap-2 pt-4 md:flex-row">
        <Button
          type="default"
          onClick={() => setOpen(false)}
          className="w-full grow"
        >
          <Trans>Cancel</Trans>
        </Button>
        <Button type="primary" className="w-full grow">
          <ExternalLink href={getJuicecrowdUrl(projectId)} className="">
            <Trans>Open on Juicecrowd</Trans>
          </ExternalLink>
        </Button>
      </div>
    </Modal>
  )
}
