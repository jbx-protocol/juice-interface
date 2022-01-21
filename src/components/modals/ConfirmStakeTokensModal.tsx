import { BigNumber } from '@ethersproject/bignumber'
import { Modal } from 'antd'
import { Trans } from '@lingui/macro'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { UserContextV1 } from 'contexts/userContextV1'
import { NetworkContext } from 'contexts/networkContext'
import useContractReaderV1, {
  ContractUpdateOn,
} from 'hooks/v1/ContractReaderV1'
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
  const { contracts, transactor } = useContext(UserContextV1)
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, projectId, tokenAddress } = useContext(ProjectContext)
  const ticketContract = useErc20Contract(tokenAddress)

  const ticketsBalance = useContractReaderV1<BigNumber>({
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
        <Trans>
          Remove {tokenSymbol ?? ''} ERC20 tokens from your wallet and lock them
          in the Juicebox protocol.
        </Trans>
      </p>
      <p>
        <Trans>
          Staked {tokenSymbol ?? 'tokens'} can still be redeemed for overflow,
          and can be unstaked at any time. Right now there's no value or utility
          in staking, though there may be in the future.
        </Trans>
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
