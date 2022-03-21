import { BigNumber } from '@ethersproject/bignumber'
import { isAddress } from '@ethersproject/address'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Input, Modal, Space, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/shared/FormattedAddress'
import ImageUploader from 'components/shared/inputs/ImageUploader'
import { NetworkContext } from 'contexts/networkContext'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
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

import { weightedAmount } from 'utils/math'

import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'

import Paragraph from 'components/shared/Paragraph'

import V2ProjectRiskNotice from './V2ProjectRiskNotice'

export default function V2ConfirmPayOwnerModal({
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

  const [loading, setLoading] = useState<boolean>()
  const [preferClaimed, setPreferClaimed] = useState<boolean>(false)
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
  const [beneficiary, setBeneficiary] = useState<string | undefined>(
    userAddress,
  )

  const [form] = useForm<{ memo: string; beneficiary: string }>()

  const converter = useCurrencyConverter()
  const payProjectTx = usePayV2ProjectTx()

  const usdAmount = converter.weiToUsd(weiAmount)
  const { fundingCycle, projectMetadata, projectId, tokenAddress } =
    useContext(V2ProjectContext)

  if (!fundingCycle || !projectId || !projectMetadata) return null

  const fundingCycleMetadata = decodeV2FundingCycleMetadata(
    fundingCycle.metadata,
  )
  const reservedRate = fundingCycleMetadata.reservedRate?.toNumber()

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

  const hasIssuedTokens = tokenAddress && tokenAddress !== constants.AddressZero

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
        memo: form.getFieldValue('memo'),
        preferClaimedTokens: preferClaimed,
        beneficiary: beneficiary,
        value: weiAmount,
      },
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
        onDone: () => setLoading(false),
      },
    )
  }

  const validateCustomBeneficiary = () => {
    if (!beneficiary) {
      return Promise.reject('Address required')
    } else if (!isAddress(beneficiary)) {
      return Promise.reject('Invalid address')
    }
    return Promise.resolve()
  }

  return (
    <Modal
      title={t`Pay ${projectMetadata.name}`}
      visible={visible}
      onOk={pay}
      okText={t`Pay`}
      onCancel={onCancel}
      confirmLoading={loading}
      width={640}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <p>
          <Trans>
            Paying{' '}
            <span style={{ fontWeight: 'bold' }}>{projectMetadata.name}</span>{' '}
            is not an investment — it's a way to support the project. Any value
            or utility of the tokens you receive is determined by{' '}
            {projectMetadata.name}.
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

        <V2ProjectRiskNotice />

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
            {/* TODO # receieved tokens */}
            <div>
              {userAddress ? (
                <Trans>
                  To: <FormattedAddress address={userAddress} />
                </Trans>
              ) : null}
            </div>
          </Descriptions.Item>
          {/* Need ownerTickets: */}
          <Descriptions.Item
            // label={t`${tokenSymbolText({
            //   // tokenSymbol: tokenSymbol,
            //   capitalize: true,
            //   plural: true,
            // })} reserved`}
            label={'Tokens reserved'}
            className="content-right"
          >
            {/* TODO # owner tokens */}
            {formatWad(ownerTickets, { precision: 0 })} (Hardcoded to 0)
          </Descriptions.Item>
        </Descriptions>
        <Form form={form} layout="vertical">
          <Form.Item label={t`Memo`} name="memo" rules={[{ max: 256 }]}>
            <Input.TextArea
              placeholder={t`(Optional) Add a memo to this payment on-chain`}
              maxLength={256}
              showCount
              autoSize
            />
          </Form.Item>
          <Form.Item>
            <ImageUploader
              text={t`Add image`}
              onSuccess={url => {
                if (!url) return
                const memo = form.getFieldValue('memo') || ''
                form.setFieldsValue({
                  memo: memo ? memo + ' ' + url : url,
                })
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
              defaultValue={''}
              name={'beneficiary'}
              onAddressChange={beneficiary => {
                setBeneficiary(beneficiary)
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
            <Form.Item label={t`Receive ERC20`}>
              <Space align="start">
                <Checkbox
                  style={{ padding: 20 }}
                  checked={preferClaimed}
                  onChange={e => setPreferClaimed(e.target.checked)}
                />
                <label htmlFor="preferClaimed">
                  <Trans>
                    Check this to mint this project's ERC20 tokens to your
                    wallet. Leave unchecked to have your token balance tracked
                    by Juicebox, saving gas on this transaction. You can always
                    claim your ERC20 tokens later.
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
