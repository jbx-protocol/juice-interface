import { t, Trans } from '@lingui/macro'
import { Modal } from 'antd'
import ExternalLink from 'components/ExternalLink'

export default function PayWarningModal({
  open,
  onOk,
  onCancel,
}: {
  open: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) {
  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={t`I understand`}
      cancelButtonProps={{ hidden: true }}
      width={400}
    >
      <h2>
        <Trans>Heads up</Trans>
      </h2>
      <p style={{ fontWeight: 500 }}>
        <Trans>
          The{' '}
          <ExternalLink href="https://github.com/jbx-protocol/juice-contracts">
            Juicebox contracts
          </ExternalLink>{' '}
          may be vulnerable to bugs or hacks. All funds moved through Juicebox
          could be lost or stolen. JuiceboxDAO and Peel are not liable for any
          losses by projects or their supporters.
        </Trans>
      </p>
    </Modal>
  )
}
