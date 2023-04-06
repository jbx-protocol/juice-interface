import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout'
import { NFT_PAYMENT_CONFIRMED_QUERY_PARAM } from 'components/NftRewards/NftPostPayModal'
import Paragraph from 'components/Paragraph'
import TransactionModal from 'components/TransactionModal'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useERC20Allowance from 'hooks/ERC20/ERC20Allowance'
import { useErc20Contract } from 'hooks/ERC20/Erc20Contract'
import { useApproveERC20Tx } from 'hooks/ERC20/transactor/ApproveTx'
import { usePayERC20PaymentTerminalTx } from 'hooks/v2v3/transactor/PayERC20PaymentTerminalTx'
import { usePayETHPaymentTerminalTx } from 'hooks/v2v3/transactor/PayETHPaymentTerminalTx'
import { useWallet } from 'hooks/Wallet'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { emitErrorNotification } from 'utils/notifications'
import { v2v3ProjectRoute } from 'utils/routes'
import { useDelegateMetadata } from './hooks/DelegateMetadata'
import { useNftRewardTiersToMint } from './hooks/NftRewardTiersToMint'
import JBERC20PaymentTerminal3_1 from './JBERC20PaymentTerminal3_1'
import { SummaryTable } from './SummaryTable'
import { V2V3PayForm, V2V3PayFormType } from './V2V3PayForm'

export const terminalNanaAddress = '0x23f9A854Ae122d9D2579788D3C3A41244B18D903'
const nanaAddress = '0xA5f37A587BE9c41Bd48CC1aEE025996Df23bBAB3'

export function V2V3ConfirmPayModal({
  open,
  weiAmount,
  onCancel,
}: {
  open?: boolean
  weiAmount: BigNumber | undefined
  onCancel?: VoidFunction
}) {
  const { fundingCycle, handle, terminals } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)
  const isNanaTerminal = terminals?.includes(terminalNanaAddress)

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [form] = useForm<V2V3PayFormType>()

  const approveERC20Tx = useApproveERC20Tx()
  const payProjectTx = usePayETHPaymentTerminalTx()
  const payProjectERC20Tx = usePayERC20PaymentTerminalTx()
  const erc20Contract = useErc20Contract(nanaAddress)

  let amountToApprove: BigNumber | undefined
  let terminalNana: Contract | undefined

  const router = useRouter()
  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
    signer,
  } = useWallet()

  // TODO: Get allowance only if needed (isNanaTerminal), not on every render
  const allowance: { data: BigNumber | undefined } = useERC20Allowance(
    nanaAddress,
    userAddress,
    terminalNanaAddress,
  )

  if (isNanaTerminal) {
    terminalNana = new Contract(
      terminalNanaAddress,
      JBERC20PaymentTerminal3_1.abi,
      signer,
    )
    amountToApprove = weiAmount?.sub(allowance.data ?? 0)
  }

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

    if (amountToApprove && amountToApprove.gt(0)) {
      try {
        const txSuccess = await approveERC20Tx({
          tokenContract: erc20Contract!,
          amountWad: amountToApprove,
          senderAddress: terminalNanaAddress,
        })

        if (!txSuccess) {
          setLoading(false)
          setTransactionPending(false)
          return
        }
      } catch (error) {
        emitErrorNotification(`Failure: ${error}`)
        setLoading(false)
        setTransactionPending(false)
        return
      }
    }

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

    const paramsERC20 = {
      erc20Terminal: terminalNana!,
      erc20Address: nanaAddress,
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
    }
    const paramsETH = {
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
    }
    const handlers = {
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
    }

    try {
      const txSuccess = isNanaTerminal
        ? await payProjectERC20Tx(paramsERC20, handlers)
        : await payProjectTx(paramsETH, handlers)

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

        <SummaryTable weiAmount={weiAmount} amountToApprove={amountToApprove} />

        <V2V3PayForm form={form} onFinish={() => executePayTx()} />
      </Space>
    </TransactionModal>
  )
}
