import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import { Callout } from 'components/Callout/Callout'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import EthereumAddress from 'components/EthereumAddress'
import Sticker from 'components/icons/Sticker'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { AttachStickerModal } from 'components/modals/AttachStickerModal/AttachStickerModal'
import { PaymentMemoSticker } from 'components/modals/AttachStickerModal/paymentMemoSticker'
import Paragraph from 'components/Paragraph'
import { Parenthesis } from 'components/Parenthesis'
import { StickerSelection } from 'components/Project/StickerSelection'
import ProjectRiskNotice from 'components/ProjectRiskNotice'
import { ProjectPreferences } from 'constants/projectPreferences'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber, constants } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { usePayV1ProjectTx } from 'hooks/v1/transactor/usePayV1ProjectTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { classNames } from 'utils/classNames'
import { formatWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  decodeFundingCycleMetadata,
  fundingCycleRiskCount,
  getUnsafeV1FundingCycleProperties,
} from 'utils/v1/fundingCycle'
import { weightAmountPerbicent } from 'utils/v1/math'

interface V1PayFormType {
  memo?: string
  stickerUrls?: string[]
  uploadedImage?: string
  preferUnstaked?: boolean
}

export default function V1ConfirmPayOwnerModal({
  open,
  weiAmount,
  onSuccess,
  onCancel,
  payButtonText,
}: {
  open?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
  payButtonText: string
}) {
  const { tokenSymbol, tokenAddress, currentFC } = useContext(V1ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const [loading, setLoading] = useState<boolean>()
  const [attachStickerModalVisible, setAttachStickerModalVisible] =
    useState<boolean>(false)

  const [form] = useForm<V1PayFormType>()

  const stickerUrls = useWatch('stickerUrls', form)

  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()
  const converter = useCurrencyConverter()
  const payProjectTx = usePayV1ProjectTx()

  const canAddMoreStickers =
    (stickerUrls ?? []).length < ProjectPreferences.MAX_IMAGES_PAYMENT_MEMO

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!weiAmount) return
    await form.validateFields()

    const {
      memo: textMemo,
      stickerUrls,
      uploadedImage,
      preferUnstaked,
    } = form.getFieldsValue()

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

    payProjectTx(
      {
        note: buildPaymentMemo({
          text: textMemo,
          imageUrl: uploadedImage,
          stickerUrls,
        }),
        preferUnstaked: preferUnstaked ?? false,
        value: weiAmount,
      },
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
        onDone: () => setLoading(false),
        onError: (error: Error) => {
          setLoading(false)
          emitErrorNotification(t`Transaction failed`, {
            description: error.message,
          })
        },
      },
    )
  }

  const fcReservedRate = decodeFundingCycleMetadata(
    currentFC?.metadata,
  )?.reservedRate

  const receivedTickets = weightAmountPerbicent(
    currentFC?.weight,
    fcReservedRate,
    weiAmount,
    'payer',
  )
  const ownerTickets = weightAmountPerbicent(
    currentFC?.weight,
    fcReservedRate,
    weiAmount,
    'reserved',
  )

  const handleStickerSelect = (sticker: PaymentMemoSticker) => {
    const url = new URL(`${window.location.origin}${sticker.filepath}`)
    const urlString = url.toString()
    const existingStickerUrls = (form.getFieldValue('stickerUrls') ??
      []) as string[]
    form.setFieldsValue({
      stickerUrls: existingStickerUrls.concat(urlString),
    })
  }

  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

  if (!projectMetadata) return null

  const riskCount = currentFC ? fundingCycleRiskCount(currentFC) : undefined

  const renderRiskNotice = () => {
    if (currentFC && riskCount && riskCount > 0) {
      return (
        <Callout.Info>
          <strong>
            <Trans>Potential risks</Trans>
          </strong>
          <ProjectRiskNotice
            unsafeProperties={getUnsafeV1FundingCycleProperties(currentFC)}
          />
        </Callout.Info>
      )
    }
  }

  return (
    <Modal
      title={t`Pay ${projectMetadata.name}`}
      open={open}
      onOk={pay}
      okText={userAddress ? payButtonText : t`Connect wallet to pay`}
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered={true}
      zIndex={1}
    >
      <Space direction="vertical" size="large" className="w-full">
        <p>
          <Trans>
            Paying <span className="font-medium">{projectMetadata.name}</span>{' '}
            is not an investment — it's a way to support the project. Any value
            or utility of the tokens you receive is determined by{' '}
            {projectMetadata.name}.
          </Trans>
        </p>

        {projectMetadata.payDisclosure && (
          <div>
            <h4>
              <Trans>Notice from {projectMetadata.name}</Trans>
            </h4>
            <Paragraph description={projectMetadata.payDisclosure} />
          </div>
        )}
        {renderRiskNotice()}
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t`Pay amount`} className="content-right">
            <USDAmount amount={usdAmount} />{' '}
            <Parenthesis>
              <ETHAmount amount={weiAmount} />
            </Parenthesis>
          </Descriptions.Item>
          <Descriptions.Item
            label={t`${tokenSymbolText({
              tokenSymbol,
              capitalize: true,
              plural: true,
            })} for you`}
            className="content-right"
          >
            <div>{formatWad(receivedTickets, { precision: 0 })}</div>
            <div>
              {userAddress ? (
                <Trans>
                  To: <EthereumAddress address={userAddress} />
                </Trans>
              ) : null}
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={t`${tokenSymbolText({
              tokenSymbol,
              capitalize: true,
              plural: true,
            })} reserved`}
            className="content-right"
          >
            {formatWad(ownerTickets, { precision: 0 })}
          </Descriptions.Item>
        </Descriptions>
        <Form form={form} layout="vertical">
          <div className="relative">
            <Form.Item
              name="memo"
              label={t`Memo (optional)`}
              className="antd-no-number-handler mb-0"
              extra={t`Add an on-chain memo to this payment.`}
            >
              <Input.TextArea
                placeholder={t`WAGMI!`}
                maxLength={256}
                onPressEnter={e => e.preventDefault()} // prevent new lines in memo
                showCount
                autoSize
              />
            </Form.Item>
            {/* Sticker select icon (right side of memo input) */}
            <div className="absolute right-2 top-9 text-sm">
              {
                <Sticker
                  className={classNames(
                    'text-grey-500 dark:text-grey-300',
                    canAddMoreStickers
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed',
                  )}
                  size={20}
                  onClick={() => {
                    canAddMoreStickers
                      ? setAttachStickerModalVisible(true)
                      : undefined
                  }}
                />
              }
            </div>
          </div>
          <Form.Item name="stickerUrls">
            <StickerSelection />
          </Form.Item>

          <Form.Item name="uploadedImage">
            <FormImageUploader text={t`Add image`} />
          </Form.Item>
          {hasIssuedTokens && (
            <Form.Item
              name="preferUnstaked"
              valuePropName="checked"
              extra={
                <Trans>
                  Check this to mint {tokenSymbol} ERC-20 to your wallet. Leave
                  unchecked to have the Juicebox protocol internally track your
                  token balance, saving gas on this transaction. You can claim
                  your ERC-20 tokens later.
                </Trans>
              }
            >
              <Checkbox>
                <Trans>Receive ERC-20</Trans>
              </Checkbox>
            </Form.Item>
          )}
        </Form>
        <AttachStickerModal
          open={attachStickerModalVisible}
          onClose={() => setAttachStickerModalVisible(false)}
          onSelect={sticker => {
            if (typeof window === 'undefined') {
              return
            }
            handleStickerSelect(sticker)
          }}
        />
      </Space>
    </Modal>
  )
}
