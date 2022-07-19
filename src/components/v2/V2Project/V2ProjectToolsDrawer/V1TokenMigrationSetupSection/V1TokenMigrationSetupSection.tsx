import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { useContext, useState } from 'react'
import { useV1ProjectIdOfV2Project } from 'hooks/v2/contractReader/V1ProjectIdOfV2Project'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { V1TokenMigrationSetupModal } from './V1TokenMigrationSetupModal'

export function V1TokenMigrationSetupSection() {
  const [migrationModalVisible, setMigrationModalVisible] =
    useState<boolean>(false)
  const { projectId } = useContext(V2ProjectContext)

  const { data: v1Project, loading: v1ProjectLoading } =
    useV1ProjectIdOfV2Project(
      !migrationModalVisible ? projectId : undefined, // reload project ID when the user closes the modal.
    )
  const hasV1ProjectId = Boolean(v1Project?.toNumber() ?? 0 > 0)

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

      {v1ProjectLoading ? (
        <p>
          <LoadingOutlined spin />
        </p>
      ) : hasV1ProjectId ? (
        <p>V1 Project ID: {v1Project?.toString()}</p>
      ) : null}

      <Button
        onClick={() => setMigrationModalVisible(true)}
        type="primary"
        size="small"
        disabled={hasV1ProjectId}
      >
        <Trans>Set up token migration</Trans>
      </Button>

      <V1TokenMigrationSetupModal
        visible={migrationModalVisible}
        onOk={() => setMigrationModalVisible(false)}
        onCancel={() => setMigrationModalVisible(false)}
      />
    </section>
  )
}
