import { Trans } from '@lingui/macro'
import { Button, Col, Divider, Modal, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useERC20Allowance from 'hooks/v2/nft/ERC20Allowance'
import { useLockTx } from 'hooks/v2/nft/LockTx'
import { useContext } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbol: string
  tokensStaked: number
  votingPower: number
  daysStaked: number
  maxLockDuration: number
  onCancel: VoidFunction
  onOk: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbol,
  tokensStaked,
  votingPower,
  daysStaked,
  maxLockDuration,
  onCancel,
  onOk,
}: ConfirmStakeModalProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenAddress } = useContext(V2ProjectContext)
  const { data: allowance } = useERC20Allowance(
    tokenAddress,
    tokenAddress,
    userAddress,
  )

  const lockTx = useLockTx()

  async function lock() {
    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txSuccess = await lockTx(
      {
        value: BigNumber.from(10),
        lockDuration: BigNumber.from(daysStaked),
        beneficiary: userAddress!,
      },
      {
        onConfirmed() {},
        onDone() {},
      },
    )

    if (!txSuccess) {
      return
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText={`Lock $${tokenSymbol}`}
    >
      <h2>Data</h2>
      <p>Token address: {tokenAddress}</p>
      <p>Allowance: {allowance ? allowance.toString() : 'Loading'}</p>
      <Button onClick={lock}>Mint NFT</Button>
      <h4>Stake</h4>
      <div style={{ color: colors.text.secondary, textAlign: 'center' }}>
        <p>
          <Trans>
            Voting Power = Tokens * ( Lock Time Remaining / Max Lock Time )
          </Trans>
        </p>
        <p>
          {votingPower} = {tokensStaked} ${tokenSymbol} * {daysStaked} days /{' '}
          {maxLockDuration} days
        </p>
      </div>
      <h4>
        <Trans>
          You are agreeing to irrevocably lock your tokens for {daysStaked} days
          in exchange for {votingPower} ve{tokenSymbol}.
        </Trans>
      </h4>
      <Divider />
      <h4>$ve{tokenSymbol} NFT summary:</h4>
      <Row>
        <Col span={4}></Col>
        <Col span={6}>
          <p>Staked ${tokenSymbol}:</p>
          <p>Start lock time:</p>
          <p>Staked period:</p>
        </Col>
        <Col span={8}>
          <p>{tokensStaked}</p>
          <p>13/04/22 10:15:00</p>
          <p>
            {daysStaked} days / {daysStaked} remaining
          </p>
        </Col>
        <Col span={6}>Image</Col>
      </Row>
    </Modal>
  )
}
