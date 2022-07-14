import { t, Trans } from '@lingui/macro'
import { Col, Divider, Modal, Row, Image } from 'antd'
import FormattedAddress from 'components/FormattedAddress'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useLockTx } from 'hooks/veNft/transactor/LockTx'

import { useContext, useState } from 'react'
import { formattedNum, parseWad } from 'utils/formatNumber'

import { detailedTimeString } from 'utils/formatTime'
import { emitSuccessNotification } from 'utils/notifications'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbol: string
  tokensStaked: number
  votingPower: number
  lockDuration: number
  beneficiary: string
  maxLockDuration: number
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMetadata: any
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbol,
  tokensStaked,
  votingPower,
  lockDuration,
  beneficiary,
  maxLockDuration,
  tokenMetadata,
  onCancel,
  onCompleted,
}: ConfirmStakeModalProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const [loading, setLoading] = useState(false)
  const recipient = beneficiary !== '' ? beneficiary : userAddress!

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

    setLoading(true)

    const txSuccess = await lockTx(
      {
        account: userAddress!,
        value: tokensStakedInWad,
        lockDuration: lockDuration,
        beneficiary: recipient,
        useJbToken: true,
        allowPublicExtension: false,
      },
      {
        onConfirmed() {
          setLoading(false)
          emitSuccessNotification(
            t`Lock successful. Results will be indexed in a few moments.`,
          )
          onCompleted()
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={lock}
      okText={`Lock $${tokenSymbol}`}
      confirmLoading={loading}
    >
      <h2>
        <Trans>Confirm Stake</Trans>
      </h2>
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
      <h4>
        <Trans>$ve{tokenSymbol} NFT summary:</Trans>
      </h4>
      <Row>
        <Col span={14}>
          <Row align="top" gutter={0}>
            <Col span={12}>
              <p>
                <Trans>Staked ${tokenSymbol}:</Trans>
              </p>
              <p>
                <Trans>Lock Duration:</Trans>
              </p>
              <p>
                <Trans>$ve{tokenSymbol} Received:</Trans>
              </p>
              <p>
                <Trans>Beneficiary:</Trans>
              </p>
            </Col>
            <Col span={12}>
              <p>{formattedNum(tokensStaked)}</p>
              <p>{formattedLockDuration}</p>
              <p>{formattedNum(votingPower)}</p>
              <FormattedAddress address={recipient} />
            </Col>
          </Row>
        </Col>
        <Col span={4} />
        <Col span={6}>
          <Image
            src={tokenMetadata && tokenMetadata.thumbnailUri}
            preview={false}
          ></Image>
        </Col>
      </Row>
    </Modal>
  )
}
