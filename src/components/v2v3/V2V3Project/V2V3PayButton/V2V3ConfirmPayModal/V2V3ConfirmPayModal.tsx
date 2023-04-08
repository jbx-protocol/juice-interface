import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { NFT_PAYMENT_CONFIRMED_QUERY_PARAM } from 'components/NftRewards/NftPostPayModal'
import Paragraph from 'components/Paragraph'
import TransactionModal from 'components/TransactionModal'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/PayETHPaymentTerminalTx'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { emitErrorNotification } from 'utils/notifications'
import { v2v3ProjectRoute } from 'utils/routes'
import { useDelegateMetadata } from './hooks/DelegateMetadata'
import { useNftRewardTiersToMint } from './hooks/NftRewardTiersToMint'
import { SummaryTable } from './SummaryTable'
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
  const { fundingCycle, handle } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [form] = useForm<V2V3PayFormType>()

  const payProjectTx = usePayETHPaymentTerminalTx()

  const router = useRouter()
  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()
  const delegateMetadata = useDelegateMetadata()
  const nftRewardTiers = useNftRewardTiersToMint()

  if (!fundingCycle || !projectId || !projectMetadata) return null

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

  async function executePayTx() {
    if (!weiAmount || !projectId) return

    const {
      beneficiary,
      memo: textMemo,
      preferClaimedTokens,
      stickerUrls,
      uploadedImage,
    } = form.getFieldsValue()

    const txBeneficiary = beneficiary ?? userAddress

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
            nftUrls: nftRewardTiers?.map(tier => tier.fileUrl),
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
        onCancel?.()
      }}
      confirmLoading={loading}
      width={640}
      centered
      destroyOnClose
    >
      <div className="flex flex-col gap-6">
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
        <SummaryTable weiAmount={weiAmount} />
        <V2V3PayForm form={form} onFinish={() => executePayTx()} />
      </div>
    </TransactionModal>
  )
}
