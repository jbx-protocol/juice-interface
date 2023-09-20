import { Trans } from '@lingui/macro'
import { Modal } from 'antd'
import { ExternalLinkWithIcon } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ui/ExternalLinkWithIcon'
import { helpPagePath } from 'utils/routes'
import { usePayoutsTable } from '../../hooks/usePayoutsTable'

export function SwitchToUnlimitedModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) {
  const { setDistributionLimit, setSplits100Percent } = usePayoutsTable()

  const onOk = () => {
    setDistributionLimit(undefined)
    setSplits100Percent()
    onClose()
  }

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
          Turn on unlimited payouts, and convert all your amounts to
          percentages.
        </Trans>
      </p>
      <ExternalLinkWithIcon href={helpPagePath(`/user/project/#payouts`)}>
        <Trans>Learn more about unlimited payouts</Trans>
      </ExternalLinkWithIcon>
    </Modal>
  )
}
