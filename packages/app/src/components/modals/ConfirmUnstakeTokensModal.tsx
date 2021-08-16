import { BigNumber } from '@ethersproject/bignumber'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { useContext, useLayoutEffect, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad, parseWad } from 'utils/formatNumber'

export default function ConfirmUnstakeTokensModal({
  visible,
  onCancel,
}: {
  visible?: boolean
  onCancel?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [unstakeAmount, setUnstakeAmount] = useState<string>()
  const { contracts, transactor, userAddress } = useContext(UserContext)
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
    if (!transactor || !contracts || !userAddress || !projectId) return

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
      title={'Unstake ' + (tokenSymbol ?? 'tokens')}
      visible={visible}
      onOk={unstake}
      okText="Unstake"
      confirmLoading={loading}
      onCancel={onCancel}
      width={600}
      centered={true}
    >
      <p>
        Withdraw your {tokenSymbol ?? 'tokens'} as ERC20 to your wallet. You can
        still redeem unstaked {tokenSymbol ?? 'tokens'} for overflow.
      </p>
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
    </Modal>
  )
}
