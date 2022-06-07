import { Trans } from '@lingui/macro'
import { Col, Divider, Modal, Row, Image } from 'antd'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useLockTx } from 'hooks/v2/nft/LockTx'

import { useContext } from 'react'
import { parseWad } from 'utils/formatNumber'

import { detailedTimeString } from 'utils/formatTime'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbol: string
  tokensStaked: number
  votingPower: number
  lockDuration: number
  maxLockDuration: number
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMetadata: any
  onCancel: VoidFunction
  onOk: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbol,
  tokensStaked,
  votingPower,
  lockDuration,
  maxLockDuration,
  tokenMetadata,
  onCancel,
  onOk,
}: ConfirmStakeModalProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress, onSelectWallet } = useContext(NetworkContext)

  const tokensStakedInWad = parseWad(tokensStaked)

  const formattedLockDuration = detailedTimeString({
    timeSeconds: lockDuration,
    fullWords: true,
  })
  const formattedMaxLockDuration = detailedTimeString({
    timeSeconds: maxLockDuration,
    fullWords: true,
  })

  const lockTx = useLockTx()

  async function lock() {
    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }

    const txSuccess = await lockTx(
      {
        value: tokensStakedInWad,
        lockDuration: lockDuration,
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
      onOk={lock}
      okText={`Lock $${tokenSymbol}`}
    >
      <h2>Confirm Stake</h2>
      <div style={{ color: colors.text.secondary, textAlign: 'center' }}>
        <p>
          {votingPower} = {tokensStaked} ${tokenSymbol} * ({' '}
          {formattedLockDuration} / {formattedMaxLockDuration} )
        </p>
      </div>
      <h4>
        <Trans>
          You are agreeing to IRREVOCABLY lock your tokens for{' '}
          {formattedLockDuration} in exchange for {votingPower} $ve{tokenSymbol}
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
          <p>{formattedLockDuration}</p>
        </Col>
        <Col span={6}>
          NFT
          <Image
            src={tokenMetadata && tokenMetadata.thumbnailUri}
            preview={false}
          ></Image>
        </Col>
      </Row>
    </Modal>
  )
}
