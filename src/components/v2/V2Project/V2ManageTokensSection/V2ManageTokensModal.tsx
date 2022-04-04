import { t } from '@lingui/macro'
import { Modal } from 'antd'

export default function V2ManageTokensModal({
  visible,
  onCancel,
}: {
  visible: boolean
  onCancel: VoidFunction
}) {
  return (
    <Modal
      // title={t`Manage ${tokenSymbolText({
      //   tokenSymbol: tokenSymbol,
      //   capitalize: false,
      //   plural: true,
      //   includeTokenWord: true,
      // })}`}
      title={t`Manage tokens`}
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{ hidden: true }}
      centered
    >
      TODO
    </Modal>
  )
}
