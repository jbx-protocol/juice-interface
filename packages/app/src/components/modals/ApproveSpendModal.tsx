import { Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { constants } from 'ethers'
import { useContext } from 'react'

export default function ApproveSpendModal({
  visible,
  onSuccess,
  onCancel,
}: {
  visible?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { weth, transactor, contracts } = useContext(UserContext)

  function approve() {
    if (!transactor || !contracts || !weth?.contract) return

    transactor(
      weth.contract,
      'approve',
      [contracts.Juicer?.address, constants.MaxUint256.toHexString()],
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  return (
    <Modal
      visible={visible}
      onOk={approve}
      onCancel={onCancel}
      okText="Approve"
      centered={true}
    >
      <h2>Allow Juice to spend your {weth?.symbol}?</h2>
    </Modal>
  )
}
