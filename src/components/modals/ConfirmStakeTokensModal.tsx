import { BigNumber } from '@ethersproject/bignumber'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { NetworkContext } from 'contexts/networkContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useContext, useLayoutEffect, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad, parseWad } from 'utils/formatNumber'
import { useErc20Contract } from 'hooks/Erc20Contract'

export default function ConfirmStakeTokensModal({
  visible,
  onCancel,
  ticketsUpdateOn,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  ticketsUpdateOn?: ContractUpdateOn
}) {
  const [loading, setLoading] = useState<boolean>()
  const [stakeAmount, setStakeAmount] = useState<string>()
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, projectId, tokenAddress } = useContext(ProjectContext)
  const ticketContract = useErc20Contract(tokenAddress)

  const ticketsBalance = useContractReader<BigNumber>({
    contract: ticketContract,
    functionName: 'balanceOf',
    args: ticketContract && userAddress ? [userAddress] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: ticketsUpdateOn,
  })

  useLayoutEffect(() => {
    setStakeAmount(fromWad(ticketsBalance))
  }, [ticketsBalance])

  function stake() {
    if (!transactor || !contracts || !userAddress || !projectId) return

    setLoading(true)

    transactor(
      contracts.TicketBooth,
      'stake',
      [
        userAddress,
        projectId.toHexString(),
        parseWad(stakeAmount).toHexString(),
      ],
      {
        onDone: () => setLoading(false),
        onConfirmed: onCancel ? () => onCancel() : undefined,
      },
    )
  }

  return (
    <Modal
      title={'Stake ' + (tokenSymbol ?? 'tokens')}
      visible={visible}
      onOk={stake}
      okText="Stake"
      confirmLoading={loading}
      onCancel={onCancel}
      width={600}
      centered={true}
    >
      <p>
        Remove {tokenSymbol ?? ''} ERC20 tokens from your wallet and lock them
        in the Juicebox protocol.
      </p>
      <p>
        Staked {tokenSymbol ?? 'tokens'} can still be redeemed for overflow, and
        can be unstaked at any time. Right now there's no value or utility in
        staking, though there may be in the future.
      </p>
      <FormattedNumberInput
        min={0}
        max={parseFloat(fromWad(ticketsBalance))}
        placeholder="0"
        value={stakeAmount}
        accessory={
          <InputAccessoryButton
            content="MAX"
            onClick={() => setStakeAmount(fromWad(ticketsBalance))}
          />
        }
        onChange={val => setStakeAmount(val)}
      />
    </Modal>
  )
}
