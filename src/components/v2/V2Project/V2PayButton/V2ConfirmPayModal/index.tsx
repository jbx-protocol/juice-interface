import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Space, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/shared/FormattedAddress'
import ImageUploader from 'components/shared/inputs/ImageUploader'
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

import { FormItems } from 'components/shared/formItems'

import * as constants from '@ethersproject/constants'

import {
  getUnsafeV2FundingCycleProperties,
  V2FundingCycleRiskCount,
} from 'utils/v2/fundingCycle'

import Paragraph from 'components/shared/Paragraph'

import { weightedAmount } from 'utils/v2/math'

import TransactionModal from 'components/shared/TransactionModal'
import ProjectRiskNotice from 'components/shared/ProjectRiskNotice'
import MemoFormItem from 'components/shared/inputs/Pay/MemoFormItem'

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
    tokenAddress,
    tokenSymbol,
  } = useContext(V2ProjectContext)
  const converter = useCurrencyConverter()
  const payProjectTx = usePayV2ProjectTx()

  const [loading, setLoading] = useState<boolean>()
  const [preferClaimed, setPreferClaimed] = useState<boolean>(false)
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
  const [memo, setMemo] = useState<string>('')
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const [form] = useForm<{ beneficiary: string }>()

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

  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

  async function pay() {
    if (!weiAmount) return
    await form.validateFields()

    const beneficiary = form.getFieldValue('beneficiary')
    const txBeneficiary = beneficiary ? beneficiary : userAddress

    // Prompt wallet connect if no wallet connected
    if (!userAddress && onSelectWallet) {
      onSelectWallet()
    }
    setLoading(true)

    const txSuccess = await payProjectTx(
      {
        memo,
        preferClaimedTokens: preferClaimed,
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

  const validateCustomBeneficiary = () => {
    const beneficiary = form.getFieldValue('beneficiary')
    if (!beneficiary) {
      return Promise.reject(t`Address required`)
    } else if (!isAddress(beneficiary)) {
      return Promise.reject(t`Invalid address`)
    }
    return Promise.resolve()
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
        <Form form={form} layout="vertical">
          <MemoFormItem value={memo} onChange={setMemo} />
          <Form.Item>
            <ImageUploader
              text={t`Add image`}
              onSuccess={url => {
                if (!url) return
                setMemo(memo.length ? memo + ' ' + url : url)
              }}
            />
          </Form.Item>
          <Form.Item
            label={
              <>
                <Trans>Custom token beneficiary</Trans>
                <Switch
                  checked={customBeneficiaryEnabled}
                  onChange={setCustomBeneficiaryEnabled}
                  style={{ marginLeft: 10 }}
                />
              </>
            }
            extra={<Trans>Mint tokens to a custom address.</Trans>}
            style={{ marginBottom: '1rem' }}
          />

          {customBeneficiaryEnabled && (
            <FormItems.EthAddress
              defaultValue={undefined}
              name={'beneficiary'}
              onAddressChange={beneficiary => {
                form.setFieldsValue({ beneficiary })
              }}
              formItemProps={{
                rules: [
                  {
                    validator: validateCustomBeneficiary,
                  },
                ],
              }}
            />
          )}

          {hasIssuedTokens && (
            <Form.Item label={t`Receive ERC-20`}>
              <Space align="start">
                <Checkbox
                  style={{ padding: 20 }}
                  checked={preferClaimed}
                  onChange={e => setPreferClaimed(e.target.checked)}
                />
                <label htmlFor="preferClaimed">
                  <Trans>
                    Check this to mint this project's ERC-20 tokens to your
                    wallet. Leave unchecked to have your token balance tracked
                    by Juicebox, saving gas on this transaction. You can always
                    claim your ERC-20 tokens later.
                  </Trans>
                </label>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Space>
    </TransactionModal>
  )
}
