import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Input, Modal } from 'antd'
import { UserContext } from 'contexts/userContext'
import { useContext, useEffect, useState } from 'react'
import { erc20Contract } from 'utils/erc20Contract'
import { formatBigNum } from 'utils/formatBigNum'

export default function ApproveSpendModal({
  wantTokenAddress,
  wantTokenSymbol,
  visible,
  initialAmount,
  allowance,
  onOk,
  onCancel,
}: {
  wantTokenAddress?: string
  wantTokenSymbol?: string
  visible?: boolean
  initialAmount?: BigNumber
  allowance?: BigNumber
  onOk?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { userProvider, transactor, contracts } = useContext(UserContext)

  const [approveAmount, setApproveAmount] = useState<BigNumber>()

  const contract = erc20Contract(wantTokenAddress, userProvider?.getSigner())

  useEffect(() => setApproveAmount(initialAmount ?? BigNumber.from(0)), [
    initialAmount,
  ])

  function approve() {
    if (!transactor || !contracts || !contract) return

    transactor(contract, 'approve', [
      contracts.Juicer?.address,
      approveAmount?.toHexString(),
    ])

    if (onOk) onOk()
  }

  return (
    <Modal
      title={`Approve ${wantTokenSymbol} spending allowance`}
      visible={visible}
      onOk={approve}
      onCancel={onCancel}
      width={600}
      okText="Approve"
    >
      <Descriptions>
        <Descriptions.Item label="Current allowance">
          {formatBigNum(allowance)} {wantTokenSymbol}
        </Descriptions.Item>
      </Descriptions>
      <Input
        defaultValue={initialAmount?.toString()}
        onChange={e => setApproveAmount(BigNumber.from(e.target.value || 0))}
      />
    </Modal>
  )
}
