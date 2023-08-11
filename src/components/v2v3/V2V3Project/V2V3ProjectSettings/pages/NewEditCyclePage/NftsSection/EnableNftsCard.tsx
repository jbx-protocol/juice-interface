import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { ExternalLinkWithIcon } from 'components/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { useState } from 'react'
import { helpPagePath } from 'utils/routes'
import { EditCycleHeader } from '../EditCycleHeader'
import { EnableNftsModal } from './EnableNftsModal'

export function EnableNftsCard() {
  const [enableNftsModalOpen, setEnableNftsModalOpen] = useState<boolean>(false)
  return (
    <>
      <div className="flex items-center gap-10 rounded-lg border border-smoke-200 bg-smoke-50 p-5 dark:border-grey-600 dark:bg-slate-600">
        <EditCycleHeader
          title={<Trans>Enable NFTs for your project</Trans>}
          description={
            <Trans>
              Juicebox mints and provides extended functionality for you to sell
              or reward contributors with NFTs for your project.{' '}
              <ExternalLinkWithIcon href={helpPagePath('/user/project/#nfts')}>
                <Trans>Learn more about NFTs</Trans>
              </ExternalLinkWithIcon>
            </Trans>
          }
        />
        <Button type="ghost" onClick={() => setEnableNftsModalOpen(true)}>
          <span>
            <Trans>Enable NFTs</Trans>
          </span>
        </Button>
      </div>
      <EnableNftsModal
        open={enableNftsModalOpen}
        onClose={() => setEnableNftsModalOpen(false)}
      />
    </>
  )
}
