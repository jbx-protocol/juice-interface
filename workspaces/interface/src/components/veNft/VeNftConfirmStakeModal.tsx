import { t, Trans } from '@lingui/macro'
import { Col, Descriptions, Image, Row } from 'antd'
import Callout from 'components/Callout'
import FormattedAddress from 'components/FormattedAddress'
import TransactionModal from 'components/TransactionModal'

import { useLockTx } from 'hooks/veNft/transactor/VeNftLockTx'
import { useWallet } from 'hooks/Wallet'
import { VeNftTokenMetadata } from 'models/v2/veNft'

import { useState } from 'react'
import { formattedNum, parseWad } from 'utils/formatNumber'

import { detailedTimeString } from 'utils/formatTime'
import {
  emitErrorNotification,
  emitSuccessNotification,
} from 'utils/notifications'
import { reloadWindow } from 'utils/windowUtils'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbolDisplayText: string
  tokensStaked: number
  lockDuration: number
  beneficiary: string
  useJbToken: boolean
  allowPublicExtension: boolean
  votingPower: number
  tokenMetadata: VeNftTokenMetadata | undefined
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbolDisplayText,
  tokensStaked,
  lockDuration,
  beneficiary,
  useJbToken,
  allowPublicExtension,
  votingPower,
  tokenMetadata,
  onCancel,
  onCompleted,
}: ConfirmStakeModalProps) {
  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()
  const [loading, setLoading] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)

  const recipient = beneficiary !== '' ? beneficiary : userAddress

  const tokensStakedInWad = parseWad(tokensStaked)

  const formattedLockDuration = detailedTimeString({
    timeSeconds: lockDuration,
    fullWords: true,
  })

  const lockTx = useLockTx()

  async function lock() {
    if (!recipient) {
      emitErrorNotification(
        t`No beneficiary selected. Is your wallet connected?`,
      )
      return
    }

    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }

    setLoading(true)

    const txSuccess = await lockTx(
      {
        account: userAddress!,
        value: tokensStakedInWad,
        lockDuration: lockDuration,
        beneficiary: recipient,
        useJbToken,
        allowPublicExtension,
      },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          emitSuccessNotification(
            t`Lock successful. Results will be indexed in a few moments.`,
          )
          onCompleted()
          reloadWindow()
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  return (
    <TransactionModal
      visible={visible}
      title={t`Confirm Stake`}
      onCancel={onCancel}
      onOk={lock}
      okText={`Lock $${tokenSymbolDisplayText}`}
      confirmLoading={loading}
      transactionPending={transactionPending}
    >
      <Callout>
        <Trans>
          You are agreeing to IRREVOCABLY lock your tokens for{' '}
          {formattedLockDuration} in exchange for {votingPower} $ve
          {tokenSymbolDisplayText}
        </Trans>
      </Callout>
      <Row>
        <Col span={14}>
          <Descriptions column={1}>
            <Descriptions.Item label={t`Staked ${tokenSymbolDisplayText}`}>
              {formattedNum(tokensStaked)}
            </Descriptions.Item>
            <Descriptions.Item label={t`Lock Duration`}>
              {formattedLockDuration}
            </Descriptions.Item>
            <Descriptions.Item label={t`$ve${tokenSymbolDisplayText} Received`}>
              {formattedNum(votingPower, { precision: 2 })}
            </Descriptions.Item>
            <Descriptions.Item label={t`Beneficiary`}>
              <FormattedAddress address={recipient} />
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={4} />
        <Col span={6}>
          <Image
            src={tokenMetadata ? tokenMetadata.thumbnailUri : ''}
            preview={false}
          />
        </Col>
      </Row>
    </TransactionModal>
  )
}
