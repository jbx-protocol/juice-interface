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
import { maxEligibleRewardTier } from 'utils/v2/nftRewards'

import { V2PayForm, V2PayFormType } from '../V2PayForm'
import { NftReward } from './NftRewardCell'

const MOCK_NFTs: NFTRewardTier[] = [
  {
    name: 'Penguin dude',
    description:
      "This NFT gives you an unbelievable amount of shit IRL. And it's a penguin wearing a hat.",
    imageUrl:
      'http://www.artrights.me/wp-content/uploads/2021/09/unnamed-1.png',
    paymentThreshold: 1,
    maxSupply: 10,
    externalLink: 'https://juicebox.money',
  },
  {
    name: 'Popcorn Banny',
    description: 'This Banny loves to watch shit go down in the Discord. ',
    imageUrl:
      'https://jbx.mypinata.cloud/ipfs/QmW7TPgipVPag1W1iZPcJDE4YRv9Mb5wY9AvxgFcPaFEXH',
    paymentThreshold: 0.1,
    maxSupply: 10,
    externalLink: 'https://juicebox.money',
  },
]

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

  if (nftRewardTiers) {
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

    const imageUrls: string[] = []
    let memoMetadata: Record<string, unknown> = { version: 1 }
    if (uploadedImage) {
      memoMetadata = { ...memoMetadata, userUploadedImages: [uploadedImage] }
      imageUrls.push(uploadedImage)
    }
    if (stickerUrls) {
      memoMetadata = { ...memoMetadata, stickerUrls }
    }

    const memo =
      (textMemo ?? '') +
      (Object.keys(memoMetadata).length
        ? '\n' + JSON.stringify(memoMetadata)
        : '')

    const txSuccess = await payProjectTx(
      {
        memo: memo,
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
      centered={true}
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
