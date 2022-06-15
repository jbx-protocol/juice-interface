import { Trans } from '@lingui/macro'
import { Modal, ModalProps, Space } from 'antd'

import { AddTerminalSection } from './AddTerminalSection'
import { SetV1ProjectSection } from './SetV1ProjectSection'

export function V1TokenMigrationModal({ ...props }: ModalProps) {
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
        <AddTerminalSection />
        <SetV1ProjectSection />
      </Space>
    </Modal>
  )
}
