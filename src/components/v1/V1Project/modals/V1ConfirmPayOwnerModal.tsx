import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import FormattedAddress from 'components/FormattedAddress'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { emitErrorNotification } from 'utils/notifications'

import { usePayV1ProjectTx } from 'hooks/v1/transactor/PayV1ProjectTx'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { formattedNum, formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { V1CurrencyName } from 'utils/v1/currency'
import {
  decodeFundingCycleMetadata,
  fundingCycleRiskCount,
  getUnsafeV1FundingCycleProperties,
} from 'utils/v1/fundingCycle'
import { weightAmountPerbicent } from 'utils/v1/math'

import Callout from 'components/Callout'
import Paragraph from 'components/Paragraph'
import ProjectRiskNotice from 'components/ProjectRiskNotice'

import Sticker from 'components/icons/Sticker'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { AttachStickerModal } from 'components/modals/AttachStickerModal'
import { StickerSelection } from 'components/Project/StickerSelection'

import { buildPaymentMemo } from 'utils/buildPaymentMemo'

import { PaymentMemoSticker } from 'components/modals/AttachStickerModal/paymentMemoSticker'

import { ThemeContext } from 'contexts/themeContext'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import { ProjectPreferences } from 'constants/v1/projectPreferences'

interface V1PayFormType {
  memo?: string
  stickerUrls?: string[]
  uploadedImage?: string
  preferUnstaked?: boolean
}

export default function V1ConfirmPayOwnerModal({
  visible,
  weiAmount,
  onSuccess,
  onCancel,
  payButtonText,
}: {
  visible?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
  payButtonText: string
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [loading, setLoading] = useState<boolean>()

  const [form] = useForm<V1PayFormType>()

  const [attachStickerModalVisible, setAttachStickerModalVisible] =
    useState<boolean>(false)

  const stickerUrls = useWatch('stickerUrls', form)

  const {
    userAddress,
    chainUnsupported,
    isConnected,
    changeNetworks,
    connect,
  } = useWallet()
  const { tokenSymbol, tokenAddress, currentFC, metadata } =
    useContext(V1ProjectContext)
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

  if (!metadata) return null

  const riskCount = currentFC ? fundingCycleRiskCount(currentFC) : undefined

  const renderRiskNotice = () => {
    if (currentFC && riskCount && riskCount > 0) {
      return (
        <Callout>
          <strong>
            <Trans>Potential risks</Trans>
          </strong>
          <ProjectRiskNotice
            unsafeProperties={getUnsafeV1FundingCycleProperties(currentFC)}
          />
        </Callout>
      )
    }
  }

  return (
    <Modal
      title={t`Pay ${metadata.name}`}
      visible={visible}
      onOk={pay}
      okText={userAddress ? payButtonText : t`Connect wallet to pay`}
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered={true}
      zIndex={1}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          <Trans>
            Paying <span style={{ fontWeight: 'bold' }}>{metadata.name}</span>{' '}
            is not an investment — it's a way to support the project. Any value
            or utility of the tokens you receive is determined by{' '}
            {metadata.name}.
          </Trans>
        </p>

        {metadata.payDisclosure && (
          <div>
            <h4>
              <Trans>Notice from {metadata.name}:</Trans>
            </h4>
            <Paragraph description={metadata.payDisclosure} />
          </div>
        )}
        {renderRiskNotice()}
        <Descriptions column={1} bordered>
          <Descriptions.Item label={t`Pay amount`} className="content-right">
            {formattedNum(usdAmount)} {V1CurrencyName(V1_CURRENCY_USD)} (
            {formatWad(weiAmount)} {V1CurrencyName(V1_CURRENCY_ETH)})
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
                  To: <FormattedAddress address={userAddress} />
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
          <div style={{ position: 'relative' }}>
            <Form.Item
              name="memo"
              label={t`Memo (optional)`}
              className={'antd-no-number-handler'}
              extra={t`Add an on-chain memo to this payment.`}
              style={{ marginBottom: 0 }}
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
            <div
              style={{
                fontSize: '.8rem',
                position: 'absolute',
                right: 7,
                top: 36,
              }}
            >
              {
                <Sticker
                  style={{
                    color: colors.text.secondary,
                    cursor: canAddMoreStickers ? 'pointer' : 'not-allowed',
                  }}
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
                  unchecked to have your token balance tracked by Juicebox,
                  saving gas on this transaction. You can always claim your
                  ERC-20 tokens later.
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
          visible={attachStickerModalVisible}
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
