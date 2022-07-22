import { t, Trans } from '@lingui/macro'
import { Col, Modal, Row, Image, Descriptions } from 'antd'
import Callout from 'components/Callout'
import FormattedAddress from 'components/FormattedAddress'

import { NetworkContext } from 'contexts/networkContext'
import { useLockTx } from 'hooks/veNft/transactor/VeNftLockTx'

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
  onCancel,
  onCompleted,
}: ConfirmStakeModalProps) {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const [loading, setLoading] = useState(false)
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
      okText={`Lock $${tokenSymbolDisplayText}`}
      confirmLoading={loading}
    >
      <h2>
        <Trans>Confirm Stake</Trans>
      </h2>
      <Callout>
        <Trans>
          You are agreeing to IRREVOCABLY lock your tokens for{' '}
          {formattedLockDuration} in exchange for {votingPower} $ve
          {tokenSymbolDisplayText}
        </Trans>
      </Callout>
      <Row>
        <Col span={14}>
          <Descriptions
            title={
              <h3>
                <Trans>$ve{tokenSymbolDisplayText} NFT summary:</Trans>
              </h3>
            }
            column={1}
          >
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
            src={``} //TODO: add image
            preview={false}
          />
        </Col>
      </Row>
    </Modal>
  )
}
