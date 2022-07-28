import { t, Trans } from '@lingui/macro'
import { Col, Row, Image, Descriptions } from 'antd'
import Callout from 'components/Callout'
import FormattedAddress from 'components/FormattedAddress'
import TransactionModal from 'components/TransactionModal'

import { NetworkContext } from 'contexts/networkContext'
import { useLockTx } from 'hooks/veNft/transactor/VeNftLockTx'
import { VeNftTokenMetadata } from 'models/v2/veNft'

import { useContext, useState } from 'react'
import { formattedNum, parseWad } from 'utils/formatNumber'

import { detailedTimeString } from 'utils/formatTime'
import {
  emitErrorNotification,
  emitSuccessNotification,
} from 'utils/notifications'

type ConfirmStakeModalProps = {
  visible: boolean
  tokenSymbolDisplayText: string
  tokensStaked: number
  votingPower: number
  lockDuration: number
  beneficiary: string
  tokenMetadata: VeNftTokenMetadata | undefined
  onCancel: VoidFunction
  onCompleted: VoidFunction
}

export default function ConfirmStakeModal({
  visible,
  tokenSymbolDisplayText,
  tokensStaked,
  votingPower,
  lockDuration,
  beneficiary,
  tokenMetadata,
  onCancel,
  onCompleted,
}: ConfirmStakeModalProps) {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
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
        },
      },
    )

    if (!txSuccess) {
      setLoading(false)
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
