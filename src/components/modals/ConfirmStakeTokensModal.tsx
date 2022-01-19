import { Modal } from 'antd'
import { t, Trans } from '@lingui/macro'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import useTotalBalanceOfUser from 'hooks/contractReader/TotalBalanceOfUser'
import { useStakeTokensTx } from 'hooks/transactor/StakeTokensTx'
import { useContext, useLayoutEffect, useState } from 'react'
import { fromWad, parseWad } from 'utils/formatNumber'

export default function ConfirmStakeTokensModal({
  visible,
  onCancel,
}: {
  visible?: boolean
  onCancel?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [stakeAmount, setStakeAmount] = useState<string>()
  const { userAddress } = useContext(NetworkContext)
  const { tokenSymbol, projectId, terminal } = useContext(ProjectContext)
  const stakeTokensTx = useStakeTokensTx()

  const ticketsBalance = useTotalBalanceOfUser(
    userAddress,
    projectId,
    terminal?.name,
  )

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
