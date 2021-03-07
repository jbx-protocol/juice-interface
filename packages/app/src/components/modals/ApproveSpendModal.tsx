import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Input, Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { useContext, useEffect, useState } from 'react'
import { formatBigNum } from 'utils/formatBigNum'

export default function ApproveSpendModal({
  visible,
  initialAmount,
  allowance,
  onOk,
  onCancel,
}: {
  visible?: boolean
  initialAmount?: BigNumber
  allowance?: BigNumber
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { weth, transactor, contracts } = useContext(UserContext)

  const [approveAmount, setApproveAmount] = useState<BigNumber>()

  useEffect(() => setApproveAmount(initialAmount ?? BigNumber.from(0)), [
    initialAmount,
  ])

  function approve() {
    if (!transactor || !contracts || !weth?.contract) return

    transactor(weth.contract, 'approve', [
      contracts.Juicer?.address,
      approveAmount?.toHexString(),
    ])

    if (onOk) onOk()
  }

  return (
    <Modal
      title={`Approve ETH spending allowance`}
      visible={visible}
      onOk={approve}
      onCancel={onCancel}
      width={600}
      okText="Approve"
    >
      <Descriptions>
        <Descriptions.Item label="Current allowance">
          {formatBigNum(allowance)} ETH
        </Descriptions.Item>
      </Descriptions>
      <Input
        defaultValue={initialAmount?.toString()}
        onChange={e => setApproveAmount(BigNumber.from(e.target.value || 0))}
      />
    </Modal>
  )
}
