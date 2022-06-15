import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MinimalCollapse } from 'components/shared/MinimalCollapse'
import { useContext, useState } from 'react'
import { useV1ProjectOf } from 'hooks/v2/contractReader/V1ProjectOf'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { V1TokenMigrationModal } from './V1TokenMigrationModal/V1TokenMigrationModal'

export function V1TokenMigrationSection() {
  const [migrationModalVisible, setMigrationModalVisible] =
    useState<boolean>(false)
  const { projectId } = useContext(V2ProjectContext)

  const v1Project = useV1ProjectOf(projectId)

  return (
    <section>
      <h3>
        <Trans>V1 token migration</Trans>
      </h3>
      <p>
        <Trans>
          Allow your V1 project token holders to swap their tokens for your V2
          project tokens.
        </Trans>
      </p>

      <MinimalCollapse
        header={<Trans>Do I need this?</Trans>}
        style={{ marginBottom: '1rem' }}
      >
        <p>
          <Trans>
            If you have Juicebox project on Juicebox V1 and V2, we recommend you
            migrate to V2 exclusively.
          </Trans>
        </p>
        <p>
          <Trans>
            To do so, you need to give your V1 token holders the ability to
            exchange their V1 tokens for V2 tokens. Select{' '}
            <strong>Set up token migration</strong> below to get started.
          </Trans>
        </p>
      </MinimalCollapse>

      {v1Project?.loading ? (
        <div>
          <LoadingOutlined spin />
        </div>
      ) : (
        <p>V1 Project ID: {v1Project?.data?.toString()}</p>
      )}

      <Button
        onClick={() => setMigrationModalVisible(true)}
        type="primary"
        size="small"
        // disabled={Boolean(v1Project)}
      >
        <Trans>Set up token migration</Trans>
      </Button>

      <V1TokenMigrationModal
        visible={migrationModalVisible}
        onOk={() => setMigrationModalVisible(false)}
        onCancel={() => setMigrationModalVisible(false)}
      />
    </section>
  )
}
