import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/FormattedAddress'
import { NetworkContext } from 'contexts/networkContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import { useContext, useState } from 'react'
import { formattedNum, formatWad } from 'utils/formatNumber'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  V2CurrencyName,
  V2_CURRENCY_ETH,
  V2_CURRENCY_USD,
} from 'utils/v2/currency'
import { usePayV2ProjectTx } from 'hooks/v2/transactor/PayV2ProjectTx'

import {
  getUnsafeV2FundingCycleProperties,
  V2FundingCycleRiskCount,
} from 'utils/v2/fundingCycle'

import Paragraph from 'components/Paragraph'

import { weightedAmount } from 'utils/v2/math'

import TransactionModal from 'components/TransactionModal'
import ProjectRiskNotice from 'components/ProjectRiskNotice'

import { V2PayForm, V2PayFormType } from '../V2PayForm'

export default function V2ConfirmPayModal({
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
  const {
    fundingCycle,
    fundingCycleMetadata,
    projectMetadata,
    projectId,
    tokenSymbol,
  } = useContext(V2ProjectContext)
  const converter = useCurrencyConverter()
  const payProjectTx = usePayV2ProjectTx()

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

  const riskCount = fundingCycle
    ? V2FundingCycleRiskCount(fundingCycle)
    : undefined

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
      onOk={pay}
      okText={t`Pay`}
      connectWalletText={t`Connect wallet to pay`}
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          <Trans>
            Paying <strong>{projectMetadata.name}</strong> is not an investment
            — it's a way to support the project. Any value or utility of the
            tokens you receive is determined by{' '}
            <strong>{projectMetadata.name}</strong>.
          </Trans>
        </p>

        {projectMetadata.payDisclosure && (
          <div>
            <h4>
              <Trans>Notice from {projectMetadata.name}:</Trans>
            </h4>
            <Paragraph description={projectMetadata.payDisclosure} />
          </div>
        )}

        {riskCount && fundingCycle ? (
          <ProjectRiskNotice
            unsafeProperties={getUnsafeV2FundingCycleProperties(fundingCycle)}
          />
        ) : null}

        <Descriptions column={1} bordered>
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
        <V2PayForm form={form} />
      </Space>
    </TransactionModal>
  )
}
