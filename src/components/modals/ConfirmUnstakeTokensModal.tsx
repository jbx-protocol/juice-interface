import { BigNumber } from '@ethersproject/bignumber'
import { Modal, Form, Space } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { NetworkContext } from 'contexts/networkContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useContext, useLayoutEffect, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

export default function ConfirmUnstakeTokensModal({
  visible,
  onCancel,
}: {
  visible?: boolean
  onCancel?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [unstakeAmount, setUnstakeAmount] = useState<string>()
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, projectId } = useContext(ProjectContext)

  const iouBalance = useContractReader<BigNumber>({
    contract: ContractName.TicketBooth,
    functionName: 'stakedBalanceOf',
    args:
      userAddress && projectId ? [userAddress, projectId.toHexString()] : null,
    valueDidChange: bigNumbersDiff,
  })

  useLayoutEffect(() => {
    setUnstakeAmount(fromWad(iouBalance))
  }, [iouBalance])

  function unstake() {
    if (
      !transactor ||
      !contracts ||
      !userAddress ||
      !projectId ||
      parseWad(unstakeAmount).eq(0) // Disable claiming 0 tokens
    )
      return

    setLoading(true)

    transactor(
      contracts.TicketBooth,
      'unstake',
      [
        userAddress,
        projectId.toHexString(),
        parseWad(unstakeAmount).toHexString(),
      ],
      {
        onDone: () => setLoading(false),
        onConfirmed: onCancel ? () => onCancel() : undefined,
      },
    )
  }

  return (
    <Modal
      title={'Claim ' + tokenSymbol}
      visible={visible}
      onOk={unstake}
      okText="Claim"
      confirmLoading={loading}
      okButtonProps={{ disabled: parseWad(unstakeAmount).eq(0) }}
      onCancel={onCancel}
      width={600}
      centered={true}
    >
      <Space direction="vertical" size="large">
        <div>
          <p>
            Claiming {tokenSymbol} will convert your balance to ERC20 tokens and
            mint them to your wallet.
          </p>
          <p style={{ fontWeight: 600 }}>
            If you're unsure if you need to claim, you probably don't.
          </p>
          <p>
            You can still redeem your {tokenSymbol} for overflow without
            claiming them, and you can transfer unclaimed tokens to another
            address from the Tools menu, which can be accessed from the wrench
            icon in the upper right hand corner of this project.
          </p>
        </div>

        <div>
          <label>Unclaimed {tokenSymbol}:</label> {formatWad(iouBalance)}
        </div>

        <Form layout="vertical">
          <Form.Item label="Amount of tokens to claim">
            <FormattedNumberInput
              min={0}
              max={parseFloat(fromWad(iouBalance))}
              placeholder="0"
              value={unstakeAmount}
              accessory={
                <InputAccessoryButton
                  content="MAX"
                  onClick={() => setUnstakeAmount(fromWad(iouBalance))}
                />
              }
              onChange={val => setUnstakeAmount(val)}
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
