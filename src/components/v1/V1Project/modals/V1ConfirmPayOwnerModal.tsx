import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/FormattedAddress'
import ImageUploader from 'components/inputs/ImageUploader'
import { emitErrorNotification } from 'utils/notifications'
import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import * as constants from '@ethersproject/constants'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'

import { useContext, useState } from 'react'
import { V1CurrencyName } from 'utils/v1/currency'
import { formattedNum, formatWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  decodeFundingCycleMetadata,
  fundingCycleRiskCount,
  getUnsafeV1FundingCycleProperties,
} from 'utils/v1/fundingCycle'
import { usePayV1ProjectTx } from 'hooks/v1/transactor/PayV1ProjectTx'

import Paragraph from 'components/Paragraph'
import ProjectRiskNotice from 'components/ProjectRiskNotice'
import MemoFormItem from 'components/inputs/Pay/MemoFormItem'
import Callout from 'components/Callout'

import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

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
  const [loading, setLoading] = useState<boolean>()
  const [preferUnstaked, setPreferUnstaked] = useState<boolean>(false)
  const [memo, setMemo] = useState<string>('')

  const [form] = useForm()

  const { userAddress, onSelectWallet } = useContext(NetworkContext)
  const { tokenSymbol, tokenAddress, currentFC, metadata } =
    useContext(V1ProjectContext)
  const converter = useCurrencyConverter()

  const payProjectTx = usePayV1ProjectTx()

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!weiAmount) return
    await form.validateFields()

    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }
    setLoading(true)

    payProjectTx(
      {
        note: memo,
        preferUnstaked,
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

  const receivedTickets = weightedRate(
    currentFC?.weight,
    fcReservedRate,
    weiAmount,
    'payer',
  )
  const ownerTickets = weightedRate(
    currentFC?.weight,
    fcReservedRate,
    weiAmount,
    'reserved',
  )

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
              tokenSymbol: tokenSymbol,
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
              tokenSymbol: tokenSymbol,
              capitalize: true,
              plural: true,
            })} reserved`}
            className="content-right"
          >
            {formatWad(ownerTickets, { precision: 0 })}
          </Descriptions.Item>
        </Descriptions>
        <Form form={form} layout="vertical">
          <MemoFormItem value={memo} onChange={setMemo} />

          <Form.Item>
            <ImageUploader
              text={t`Add image`}
              onSuccess={url => {
                if (!url) return
                const note = form.getFieldValue('note') || ''
                form.setFieldsValue({
                  note: note ? note + ' ' + url : url,
                })
              }}
            />
          </Form.Item>
          {hasIssuedTokens && (
            <Form.Item label={t`Receive ERC-20`}>
              <Space align="start">
                <Checkbox
                  style={{ padding: 20 }}
                  checked={preferUnstaked}
                  onChange={e => setPreferUnstaked(e.target.checked)}
                />
                <label htmlFor="preferUnstaked">
                  <Trans>
                    Check this to mint {tokenSymbol} ERC-20 to your wallet.
                    Leave unchecked to have your token balance tracked by
                    Juicebox, saving gas on this transaction. You can always
                    claim your ERC-20 tokens later.
                  </Trans>
                </label>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Space>
    </Modal>
  )
}
