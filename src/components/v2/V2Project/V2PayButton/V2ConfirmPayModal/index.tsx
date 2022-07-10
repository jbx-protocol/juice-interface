import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/FormattedAddress'
import { NetworkContext } from 'contexts/networkContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import TooltipLabel from 'components/TooltipLabel'

import { NFTRewardTier } from 'models/v2/nftRewardTier'

import { useContext, useState } from 'react'
import { formattedNum, formatWad, fromWad } from 'utils/formatNumber'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  V2CurrencyName,
  V2_CURRENCY_ETH,
  V2_CURRENCY_USD,
} from 'utils/v2/currency'
import { usePayV2ProjectTx } from 'hooks/v2/transactor/PayV2ProjectTx'

import Paragraph from 'components/Paragraph'
import { weightedAmount } from 'utils/v2/math'
import TransactionModal from 'components/TransactionModal'
import Callout from 'components/Callout'
import useMobile from 'hooks/Mobile'
import { maxEligibleRewardTier, MOCK_NFTs } from 'utils/v2/nftRewards'
import { featureFlagEnabled } from 'utils/featureFlags'

import { V2PayForm, V2PayFormType } from '../V2PayForm'
import { NftReward } from './NftRewardCell'

/**
 * Produce payment memo with the following schema:
 * <text memo> <sticker URLs> <uploaded image URL>
 */
const buildPaymentMemo = ({
  text = '',
  imageUrl,
  stickerUrls,
}: {
  text?: string
  imageUrl?: string
  stickerUrls?: string[]
}) => {
  let memo = `${text}`

  if (stickerUrls?.length) {
    memo += `\n${stickerUrls.join(' ')}`
  }

  if (imageUrl) {
    memo += `\n${imageUrl}`
  }

  return memo
}

export function V2ConfirmPayModal({
  visible,
  weiAmount,
  onSuccess,
  onCancel,
}: {
  visible?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const isMobile = useMobile()

  const {
    fundingCycle,
    fundingCycleMetadata,
    projectMetadata,
    projectId,
    tokenSymbol,
    // nftRewardTiers
  } = useContext(V2ProjectContext)
  const converter = useCurrencyConverter()
  const payProjectTx = usePayV2ProjectTx()

  const nftRewardTiers = MOCK_NFTs

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<V2PayFormType>()

  const usdAmount = converter.weiToUsd(weiAmount)

  if (!fundingCycle || !projectId || !projectMetadata) return null

  const reservedRate = fundingCycleMetadata?.reservedRate?.toNumber()

  const receivedTickets = weightedAmount(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'payer',
  )
  const ownerTickets = weightedAmount(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'reserved',
  )
  let nftReward: NFTRewardTier | null = null

  if (nftRewardTiers && featureFlagEnabled('nftRewards')) {
    nftReward = maxEligibleRewardTier({
      nftRewardTiers,
      ethPayAmount: parseFloat(fromWad(weiAmount)),
    })
  }

  async function pay() {
    if (!weiAmount) return
    await form.validateFields()

    const {
      beneficiary,
      memo: textMemo,
      preferClaimed,
      stickerUrls,
      uploadedImage,
    } = form.getFieldsValue()
    const txBeneficiary = beneficiary ? beneficiary : userAddress

    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }
    setLoading(true)

    const txSuccess = await payProjectTx(
      {
        memo: buildPaymentMemo({
          text: textMemo,
          imageUrl: uploadedImage,
          stickerUrls,
        }),
        preferClaimedTokens: !!preferClaimed,
        beneficiary: txBeneficiary,
        value: weiAmount,
      },
      {
        onConfirmed() {
          setLoading(false)
          setTransactionPending(false)

          onSuccess?.()
        },
        onDone() {
          setTransactionPending(true)
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
      transactionPending={transactionPending}
      title={t`Pay ${projectMetadata.name}`}
      visible={visible}
      onOk={() => form.submit()}
      okText={t`Pay`}
      connectWalletText={t`Connect wallet to pay`}
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered
      destroyOnClose
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {projectMetadata.payDisclosure && (
          <Callout>
            <strong>
              <Trans>Notice from {projectMetadata.name}</Trans>
            </strong>
            <Paragraph description={projectMetadata.payDisclosure} />
          </Callout>
        )}

        <Descriptions column={1} bordered size={isMobile ? 'small' : 'default'}>
          <Descriptions.Item label={t`Pay amount`} className="content-right">
            {formattedNum(usdAmount)} {V2CurrencyName(V2_CURRENCY_USD)} (
            {formatWad(weiAmount)} {V2CurrencyName(V2_CURRENCY_ETH)})
          </Descriptions.Item>
          <Descriptions.Item
            label={t`${tokenSymbolText({
              capitalize: true,
              plural: true,
            })} for you`}
            className="content-right"
          >
            <div>{formatWad(receivedTickets, { precision: 0 })}</div>
            <div style={{ fontSize: '0.7rem' }}>
              {userAddress ? (
                <Trans>
                  To: <FormattedAddress address={userAddress} />
                </Trans>
              ) : null}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={t`${tokenSymbolText({
              tokenSymbol: tokenSymbol,
              capitalize: true,
              plural: true,
            })} reserved`}
            className="content-right"
          >
            {formatWad(ownerTickets, { precision: 0 })}
          </Descriptions.Item>
          {nftReward ? (
            <Descriptions.Item
              label={
                <TooltipLabel
                  label={t`NFT rewards`}
                  tip={
                    <Trans>
                      Supporters receive this NFT for contributing at least{' '}
                      <strong>{nftReward.paymentThreshold} ETH</strong>.
                    </Trans>
                  }
                />
              }
              style={{ padding: '10px 24px' }}
            >
              <NftReward nftReward={nftReward} />
            </Descriptions.Item>
          ) : null}
        </Descriptions>

        <V2PayForm form={form} onFinish={() => pay()} />
      </Space>
    </TransactionModal>
  )
}
