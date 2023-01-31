import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import FormattedAddress from 'components/FormattedAddress'
import { NFT_PAYMENT_CONFIRMED_QUERY_PARAM } from 'components/NftRewards/NftPostPayModal'
import Paragraph from 'components/Paragraph'
import { PayProjectFormContext } from 'components/Project/PayProjectForm/payProjectFormContext'
import {
  DEFAULT_ALLOW_OVERSPENDING,
  JB721DelegateV11PayMetadata,
  JB721DelegateV1PayMetadata,
} from 'components/Project/PayProjectForm/usePayProjectForm'
import TooltipLabel from 'components/TooltipLabel'
import TransactionModal from 'components/TransactionModal'
import { NftRewardsContext } from 'contexts/nftRewardsContext'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import useMobile from 'hooks/Mobile'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/PayETHPaymentTerminal'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { formattedNum, formatWad } from 'utils/format/formatNumber'
import {
  encodeJB721DelegateV1PayMetadata,
  encodeJB721DelegateV1_1PayMetadata,
  payMetadataOverrides,
  rewardTiersFromIds,
  sumTierFloors,
} from 'utils/nftRewards'
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
  open,
  weiAmount,
  onCancel,
}: {
  open?: boolean
  weiAmount: BigNumber | undefined
  onCancel?: VoidFunction
}) {
  const { fundingCycle, fundingCycleMetadata, tokenSymbol, handle } =
    useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)
  const {
    nftRewards: { rewardTiers, contractVersion: nftContractVersion },
  } = useContext(NftRewardsContext)
  const { form: payProjectForm } = useContext(PayProjectFormContext)

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

  const nftTierIdsToMint = payProjectForm?.payMetadata?.tierIdsToMint.sort()

  const nftRewardTiers =
    rewardTiers && nftTierIdsToMint
      ? rewardTiersFromIds({
          tierIds: payProjectForm?.payMetadata?.tierIdsToMint || [],
          rewardTiers,
        })
      : undefined

  const handlePaySuccess = () => {
    onCancel?.()
    setLoading(false)
    setTransactionPending(false)

    form.resetFields()

    if (nftRewardTiers && projectMetadata?.nftPaymentSuccessModal) {
      router.replace(
        `${v2v3ProjectRoute({
          handle,
          projectId,
        })}?${NFT_PAYMENT_CONFIRMED_QUERY_PARAM}=1`,
      )
    }
  }

  async function pay() {
    if (!weiAmount || !projectId) return

    const {
      beneficiary,
      memo: textMemo,
      preferClaimedTokens,
      stickerUrls,
      uploadedImage,
    } = form.getFieldsValue()

    const txBeneficiary = beneficiary ?? userAddress

    const delegateMetadata =
      nftContractVersion === '1' // old delegate v1
        ? encodeJB721DelegateV1PayMetadata({
            ...(payProjectForm?.payMetadata as JB721DelegateV1PayMetadata),
            ...payMetadataOverrides(projectId),
          })
        : // new delegate v1.1
          encodeJB721DelegateV1_1PayMetadata({
            ...(payProjectForm?.payMetadata as JB721DelegateV11PayMetadata),
            allowOverspending: DEFAULT_ALLOW_OVERSPENDING,
          })

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
          delegateMetadata,
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
      open={open}
      onOk={() => form.submit()}
      okText={t`Pay`}
      connectWalletText={t`Connect wallet to pay`}
      onCancel={() => {
        form.resetFields()
        // resetFields sets to initialValues, which includes NFTs, so have to remove them manually
        form.setFieldValue('stickerUrls', [])
        onCancel?.()
      }}
      confirmLoading={loading}
      width={640}
      centered
      destroyOnClose
    >
      <Space direction="vertical" size="large" className="w-full">
        {projectMetadata.payDisclosure && (
          <Callout.Info className="border border-solid border-grey-200 dark:border-grey-400">
            <strong className="block">
              <Trans>Notice from {projectMetadata.name}</Trans>
            </strong>
            <Paragraph
              className="text-sm"
              description={projectMetadata.payDisclosure}
            />
          </Callout.Info>
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
            <div className="text-xs">
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
          {nftRewardTiers?.length ? (
            <Descriptions.Item
              className="py-3 px-6"
              label={
                <TooltipLabel
                  label={t`NFTs for you`}
                  tip={
                    <Trans>
                      You receive these NFTs for contributing{' '}
                      <strong>
                        {sumTierFloors(nftRewardTiers)} ETH or more
                      </strong>
                      .
                    </Trans>
                  }
                />
              }
            >
              <NftRewardCell nftRewards={nftRewardTiers} />
            </Descriptions.Item>
          ) : null}
        </Descriptions>

        <V2V3PayForm
          form={form}
          onFinish={() => pay()}
          nftRewardTiers={nftRewardTiers}
        />
      </Space>
    </TransactionModal>
  )
}
