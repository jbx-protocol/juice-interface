import { Modal } from 'antd'

export default function PayWarningModal({
  visible,
  onOk,
  onCancel,
}: {
  visible: boolean
  onOk: VoidFunction
  onCancel: VoidFunction
}) {
  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="I understand"
      cancelButtonProps={{ hidden: true }}
      width={400}
    >
      <h2>Heads up</h2>
      <p style={{ fontWeight: 500 }}>
        <a
          href="https://github.com/jbx-protocol/juice-contracts"
          target="_blank"
          rel="noopener noreferrer"
        >
          Juicebox contracts
        </a>{' '}
        are unaudited, and may be vulnerable to bugs or hacks. All funds moved
        through Juicebox could be lost or stolen. JuiceboxDAO is not liable for
        any losses by projects or their supporters.
      </p>
    </Modal>
  )
}
