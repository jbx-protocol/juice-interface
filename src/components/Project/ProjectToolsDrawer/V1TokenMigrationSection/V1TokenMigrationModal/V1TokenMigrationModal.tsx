import { Trans } from '@lingui/macro'
import { Modal, ModalProps, Space } from 'antd'
import Callout from 'components/Callout'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useV1ProjectIdOfV2Project } from 'hooks/v2/contractReader/V1ProjectIdOfV2Project'
import { useContext, useState } from 'react'
import { CheckCircleFilled } from '@ant-design/icons'

import { AddTerminalSection } from './AddTerminalSection'
import { SetV1ProjectSection } from './SetV1ProjectSection'
import { hasV1TokenPaymentTerminal } from './utils'

export function V1TokenMigrationModal({ ...props }: ModalProps) {
  const { terminals, projectId } = useContext(V2ProjectContext)
  const [
    migrationTerminalSectionComplete,
    setMigrationTerminalSectionComplete,
  ] = useState<boolean>(false)
  const [v1ProjectSectionComplete, setV1ProjectSectionComplete] =
    useState<boolean>(false)

  const hasMigrationTerminal =
    hasV1TokenPaymentTerminal(terminals) || migrationTerminalSectionComplete
  const { data: v1Project } = useV1ProjectIdOfV2Project(projectId)
  const hasSetV1Project =
    Boolean(v1Project?.toNumber()) || v1ProjectSectionComplete

  const completed = hasMigrationTerminal && hasSetV1Project

  return (
    <Modal
      title={<Trans>Set up V1 token migration</Trans>}
      okButtonProps={{ hidden: true }}
      cancelText={<Trans>Close</Trans>}
      {...props}
    >
      <p style={{ marginBottom: '2rem' }}>
        <Trans>
          Set up your Juicebox V2 project for migration from your Juicebox V1
          project.
        </Trans>
      </p>

      <Space direction="vertical" size="large">
        <AddTerminalSection
          completed={hasMigrationTerminal}
          onCompleted={() => setMigrationTerminalSectionComplete(true)}
        />
        <SetV1ProjectSection
          completed={hasSetV1Project}
          disabled={!hasMigrationTerminal}
          onCompleted={() => setV1ProjectSectionComplete(true)}
        />

        {completed && (
          <Callout iconComponent={<CheckCircleFilled />}>
            <p>
              <Trans>You're all set!</Trans> 🎉
            </p>
            <p style={{ margin: 0 }}>
              <Trans>
                V1 token holders can swap their tokens for your V2 tokens on
                your V2 project's <strong>Tokens</strong> section.
              </Trans>
            </p>
          </Callout>
        )}
      </Space>
    </Modal>
  )
}
