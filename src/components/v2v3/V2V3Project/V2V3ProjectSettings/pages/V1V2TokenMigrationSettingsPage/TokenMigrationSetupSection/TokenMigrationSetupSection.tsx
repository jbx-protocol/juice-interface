import { Trans } from '@lingui/macro'
// import { Button } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
// import { useState } from 'react'
// import { TokenMigrationSetupModal } from './TokenMigrationSetupModal'

export function V1TokenMigrationSetupSection() {
  // const [migrationModalVisible, setMigrationModalVisible] =
  //   useState<boolean>(false)

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
      {/* <div>
        <Button
          className="mt-4"
          onClick={() => setMigrationModalVisible(true)}
          type="primary"
        >
          <Trans>Set up token migration</Trans>
        </Button>
      </div> */}
      {/* <TokenMigrationSetupModal
        open={migrationModalVisible}
        onOk={() => setMigrationModalVisible(false)}
        onCancel={() => setMigrationModalVisible(false)}
      /> */}
    </div>
  )
}
