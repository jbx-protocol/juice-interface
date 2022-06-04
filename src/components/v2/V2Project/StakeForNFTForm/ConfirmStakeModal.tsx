import { Trans } from '@lingui/macro'
import { Button, Col, Divider, Modal, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useERC20Allowance from 'hooks/v2/nft/ERC20Allowance'
import { useLockTx } from 'hooks/v2/nft/LockTx'
import { useContext } from 'react'
import { BigNumber } from '@ethersproject/bignumber'

import { fromWad, parseWad } from 'utils/formatNumber'
import useERC20Approve from 'hooks/v2/nft/ERC20Approve'

import { VEBANNY_CONTRACT_ADDRESS } from 'constants/v2/nft/nftProject'

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
    userAddress,
    VEBANNY_CONTRACT_ADDRESS,
  )
  const tokenAllowance = allowance ? fromWad(allowance, 18) : '0'

  const lockTx = useLockTx()
  const approveTx = useERC20Approve()

  async function approve() {
    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txSuccess = await approveTx({ value: parseWad(100) })

    if (!txSuccess) {
      return
    }
  }

  async function lock() {
    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txSuccess = await lockTx(
      {
        value: parseWad(10),
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
      <p>Allowance: {tokenAllowance ? tokenAllowance : 'Loading'}</p>
      <Button onClick={approve}>Approve 100 tokens</Button>
      <Button onClick={lock}>Mint NFT for 10</Button>
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
