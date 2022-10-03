import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Callout from 'components/Callout'
import FormattedAddress from 'components/FormattedAddress'
import Paragraph from 'components/Paragraph'
import TooltipLabel from 'components/TooltipLabel'
import TransactionModal from 'components/TransactionModal'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { ThemeContext } from 'contexts/themeContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/PayETHPaymentTerminal'
import { useWallet } from 'hooks/Wallet'
import { NftRewardTier } from 'models/nftRewardTier'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { featureFlagEnabled } from 'utils/featureFlags'
import { formattedNum, formatWad, fromWad } from 'utils/format/formatNumber'
import { getNftRewardTier } from 'utils/nftRewards'
import { emitErrorNotification } from 'utils/notifications'
import { v2v3ProjectRoute } from 'utils/routes'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  V2V3CurrencyName,
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'utils/v2v3/currency'
import { weightAmountPermyriad } from 'utils/v2v3/math'
import { NftRewardCell } from './NftRewardCell'
import { V2V3PayForm, V2V3PayFormType } from './V2V3PayForm'

export function V2V3ConfirmPayModal({
  visible,
  weiAmount,
  onCancel,
}: {
  visible?: boolean
  weiAmount: BigNumber | undefined
  onCancel?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { fundingCycle, fundingCycleMetadata, tokenSymbol, handle } =
    useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [form] = useForm<V2V3PayFormType>()

  const converter = useCurrencyConverter()
  const payProjectTx = usePayETHPaymentTerminalTx()
  const isMobile = useMobile()
  const router = useRouter()
  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()

  const usdAmount = converter.weiToUsd(weiAmount)
  const nftRewardTiers = rewardTiers //rewardTiers

  if (!fundingCycle || !projectId || !projectMetadata) return null

  const reservedRate = fundingCycleMetadata?.reservedRate?.toNumber()

  const receivedTickets = weightAmountPermyriad(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'payer',
  )
  const ownerTickets = weightAmountPermyriad(
    fundingCycle?.weight,
    reservedRate,
    weiAmount,
    'reserved',
  )

  const tokenText = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  let nftRewardTier: NftRewardTier | null = null
  if (nftRewardTiers && featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)) {
    nftRewardTier = getNftRewardTier({
      nftRewardTiers,
      payAmountETH: parseFloat(fromWad(weiAmount)),
    })
  }

  const handlePaySuccess = () => {
    if (onCancel) onCancel()
    setLoading(false)
    setTransactionPending(false)

    if (nftRewardTier && projectMetadata?.nftPaymentSuccessModal) {
      router.replace(
        `${v2v3ProjectRoute({ handle, projectId })}?nftPurchaseConfirmed=true`,
      )
    }
  }

  async function pay() {
    if (!weiAmount) return

    const {
      beneficiary,
      memo: textMemo,
      preferClaimedTokens,
      stickerUrls,
      uploadedImage,
    } = form.getFieldsValue()
    const txBeneficiary = beneficiary ? beneficiary : userAddress

    // Prompt wallet connect if no wallet connected
    if (chainUnsupported) {
      await changeNetworks()
      return
    }
    if (!isConnected) {
      await connect()
      return
    }
    setLoading(true)

    try {
      const txSuccess = await payProjectTx(
        {
          memo: buildPaymentMemo({
            text: textMemo,
            imageUrl: uploadedImage,
            stickerUrls,
          }),
          preferClaimedTokens: Boolean(preferClaimedTokens),
          beneficiary: txBeneficiary,
          value: weiAmount,
        },
        {
          onConfirmed() {
            handlePaySuccess()
          },
          onError() {
            setLoading(false)
            setTransactionPending(false)
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
    } catch (error) {
      emitErrorNotification(`Failure: ${error}`)
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
          <Callout
            style={{
              background: 'none',
              border: '1px solid' + colors.stroke.secondary,
            }}
          >
            <strong>
              <Trans>Notice from {projectMetadata.name}</Trans>
            </strong>
            <Paragraph
              description={projectMetadata.payDisclosure}
              style={{ fontSize: '0.8rem' }}
            />
          </Callout>
        )}

        <Descriptions column={1} bordered size={isMobile ? 'small' : 'default'}>
          <Descriptions.Item label={t`Pay amount`} className="content-right">
            {formattedNum(usdAmount)} {V2V3CurrencyName(V2V3_CURRENCY_USD)} (
            {formatWad(weiAmount)} {V2V3CurrencyName(V2V3_CURRENCY_ETH)})
          </Descriptions.Item>
          <Descriptions.Item
            label={<Trans>Tokens for you</Trans>}
            className="content-right"
          >
            <div>
              {formatWad(receivedTickets, { precision: 0 })} {tokenText}
            </div>
            <div style={{ fontSize: '0.7rem' }}>
              {userAddress ? (
                <Trans>
                  To: <FormattedAddress address={userAddress} />
                </Trans>
              ) : null}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <TooltipLabel
                label={t`Tokens reserved`}
                tip={
                  <Trans>
                    This project reserves some of the newly minted tokens for
                    itself.
                  </Trans>
                }
              />
            }
            className="content-right"
          >
            {formatWad(ownerTickets, { precision: 0 })} {tokenText}
          </Descriptions.Item>
          {nftRewardTier ? (
            <Descriptions.Item
              label={
                <TooltipLabel
                  label={t`NFT reward`}
                  tip={
                    <Trans>
                      You receive this NFT for contributing over{' '}
                      <strong>{nftRewardTier.contributionFloor} ETH</strong>.
                    </Trans>
                  }
                />
              }
              style={{ padding: '0.625rem 1.5rem' }}
            >
              <NftRewardCell nftReward={nftRewardTier} />
            </Descriptions.Item>
          ) : null}
        </Descriptions>

        <V2V3PayForm
          form={form}
          onFinish={() => pay()}
          nftRewardTier={nftRewardTier}
        />
      </Space>
    </TransactionModal>
  )
}
