import { LeftOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { Callout } from 'components/Callout'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { readNetwork } from 'constants/networks'
import { TokenAddresses } from 'constants/tokenAddresses'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { TokenMigrationSetupModal } from './TokenMigrationSetupModal'

export function V1TokenMigrationSetupSection() {
  const router = useRouter()
  const [migrationModalVisible, setMigrationModalVisible] =
    useState<boolean>(false)

  const isMigrationAvailable =
    TokenAddresses.V1TicketBooth[readNetwork.name] &&
    TokenAddresses.V2TokenStore[readNetwork.name] &&
    TokenAddresses.V3TokenStore[readNetwork.name]

  if (!isMigrationAvailable) {
    return (
      <div className="flex flex-col gap-4">
        <Callout.Info>
          <Trans>
            Token migration is currently not available for {readNetwork.name}
          </Trans>
        </Callout.Info>
        <Button
          icon={<LeftOutlined />}
          className="max-w-fit"
          onClick={router.back}
        >
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Trans>
          Allow your legacy project (<ProjectVersionBadge.V1 /> or{' '}
          <ProjectVersionBadge.V2 />) token holders to swap their tokens for
          your <ProjectVersionBadge.V3 /> project tokens.
        </Trans>
      </div>
      <MinimalCollapse header={<Trans>Do I need this?</Trans>}>
        <p>
          <Trans>
            If you have <ProjectVersionBadge.V1 /> or <ProjectVersionBadge.V2 />{' '}
            legacy Juicebox projects, we recommend you migrate to{' '}
            <ProjectVersionBadge.V3 /> exclusively.
          </Trans>
        </p>
        <p>
          <Trans>
            To do so, you need to give your legacy token holders the ability to
            exchange their tokens for V3 tokens. Select{' '}
            <strong>Set up token migration</strong> below to get started.
          </Trans>
        </p>
      </MinimalCollapse>

      <Button
        className="mt-4"
        onClick={() => setMigrationModalVisible(true)}
        type="primary"
      >
        <Trans>Set up token migration</Trans>
      </Button>
      <TokenMigrationSetupModal
        open={migrationModalVisible}
        onOk={() => setMigrationModalVisible(false)}
        onCancel={() => setMigrationModalVisible(false)}
      />
    </div>
  )
}
