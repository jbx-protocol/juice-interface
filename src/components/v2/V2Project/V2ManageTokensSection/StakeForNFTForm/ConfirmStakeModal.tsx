import { Trans } from '@lingui/macro'
import { Col, Divider, Modal, Row, Image } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbol: string
  tokensStaked: number
  votingPower: number
  daysStaked: number
  maxLockTime: number
  delegateAddress: string
  nftSvg: string
  onCancel: VoidFunction
  onOk: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbol,
  tokensStaked,
  votingPower,
  daysStaked,
  maxLockTime,
  delegateAddress,
  nftSvg,
  onCancel,
  onOk,
}: ConfirmStakeModalProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      okText={`Lock $${tokenSymbol}`}
    >
      <h4>Stake</h4>
      <p>Delegate: {delegateAddress}</p>
      <div style={{ color: colors.text.secondary, textAlign: 'center' }}>
        <p>
          <Trans>
            Voting Power = Tokens * ( Lock Time Remaining / Max Lock Time )
          </Trans>
        </p>
        <p>
          {votingPower} = {tokensStaked} ${tokenSymbol} * {daysStaked} days /{' '}
          {maxLockTime} days
        </p>
      </div>
      <h4>
        <Trans>
          You are agreeing to irrevocably lock your tokens for {daysStaked} days
          in exchange for {votingPower} ve{tokenSymbol} delegated to{' '}
          {delegateAddress}.
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
          <p>Delegate:</p>
        </Col>
        <Col span={8}>
          <p>{tokensStaked}</p>
          <p>13/04/22 10:15:00</p>
          <p>
            {daysStaked} days / {daysStaked} remaining
          </p>
          <p>{delegateAddress}</p>
        </Col>
        <Col span={6}>
          <Image src={nftSvg} preview={false} />
        </Col>
      </Row>
    </Modal>
  )
}
