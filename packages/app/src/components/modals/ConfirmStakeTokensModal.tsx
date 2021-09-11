import { BigNumber } from '@ethersproject/bignumber'
import { Modal } from 'antd'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { NetworkContext } from 'contexts/networkContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useContext, useLayoutEffect, useMemo, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad, parseWad } from 'utils/formatNumber'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { ContractName } from 'models/contract-name'

export default function ConfirmStakeTokensModal({
  visible,
  onCancel,
}: {
  visible?: boolean
  onCancel?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [stakeAmount, setStakeAmount] = useState<string>()
  const { contracts, transactor } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, projectId, tokenAddress } = useContext(ProjectContext)
  const ticketContract = useErc20Contract(tokenAddress)

  const ticketsUpdateOn: ContractUpdateOn = useMemo(
    () => [
      {
        contract: ContractName.TerminalV1,
        eventName: 'Pay',
        topics: projectId ? [[], projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TerminalV1,
        eventName: 'PrintPreminedTickets',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Redeem',
        topics: projectId ? [projectId.toHexString()] : undefined,
      },
      {
        contract: ContractName.TicketBooth,
        eventName: 'Convert',
        topics:
          userAddress && projectId
            ? [userAddress, projectId.toHexString()]
            : undefined,
      },
    ],
    [projectId],
  )

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
        Stake your {tokenSymbol ?? 'tokens'}. You can still redeem staked{' '}
        {tokenSymbol ?? 'tokens'} for overflow.
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
