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
      <h2 className="font-heading text-2xl">
        <Trans>Heads up</Trans>
      </h2>
      <strong>
        <Trans>
          The{' '}
          <ExternalLink href="https://github.com/jbx-protocol/juice-contracts-v3">
            Juicebox protocol
          </ExternalLink>{' '}
          could be vulnerable to bugs or hacks. All of the ETH moved through
          Juicebox could be lost or stolen. JuiceboxDAO and Peel are not liable
          for any losses.
        </Trans>
      </strong>
    </Modal>
  )
}
