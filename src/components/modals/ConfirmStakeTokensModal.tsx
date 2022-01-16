import { BigNumber } from '@ethersproject/bignumber'
import { Modal } from 'antd'
import { t, Trans } from '@lingui/macro'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import useContractReader, { ContractUpdateOn } from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { useStakeTokensTx } from 'hooks/transactor/StakeTokensTx'
import { useContext, useLayoutEffect, useState } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'
import { fromWad, parseWad } from 'utils/formatNumber'

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
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, tokenAddress } = useContext(ProjectContext)
  const ticketContract = useErc20Contract(tokenAddress)
  const stakeTokensTx = useStakeTokensTx()

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
    setLoading(true)

    stakeTokensTx(
      { amount: parseWad(stakeAmount) },
      {
        onDone: () => setLoading(false),
        onConfirmed: onCancel ? () => onCancel() : undefined,
      },
    )
  }

  return (
    <Modal
      title={t`Stake ${tokenSymbol ?? 'tokens'}`}
      visible={visible}
      onOk={stake}
      okText={t`Stake`}
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
            content={t`MAX`}
            onClick={() => setStakeAmount(fromWad(ticketsBalance))}
          />
        }
        onChange={val => setStakeAmount(val)}
      />
    </Modal>
  )
}
