import { Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { ExternalLinkWithIcon } from 'components/ExternalLinkWithIcon'
import { helpPagePath } from 'utils/routes'

export function SwitchToUnlimitedModal({
  open,
  onClose,
  onOk,
}: {
  open: boolean
  onClose: VoidFunction
  onOk: VoidFunction
}) {
  return (
    <Modal
      title={<Trans>Switch to unlimited payouts</Trans>}
      open={open}
      onCancel={onClose}
      onOk={onOk}
      okText={<Trans>Confirm</Trans>}
      destroyOnClose
    >
      <p>
        <Trans>
          Turn on unlimited payouts, and convert all your payout amounts to
          percentages.
        </Trans>
      </p>
      <ExternalLinkWithIcon href={helpPagePath(`/user/project/#payouts`)}>
        <Trans>Learn more about unlimited payouts</Trans>
      </ExternalLinkWithIcon>
    </Modal>
  )
}
