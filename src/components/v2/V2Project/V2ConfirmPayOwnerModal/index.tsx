import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Checkbox, Descriptions, Form, Input, Modal, Space, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/shared/FormattedAddress'
import ImageUploader from 'components/shared/inputs/ImageUploader'
import { NetworkContext } from 'contexts/networkContext'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import React, { useContext, useState } from 'react'
import { formattedNum, formatWad, fromWad } from 'utils/formatNumber'

import { tokenSymbolText } from 'utils/tokenSymbolText'
import {
  V2CurrencyName,
  V2_CURRENCY_ETH,
  V2_CURRENCY_USD,
} from 'utils/v2/currency'
import { FormItems } from 'components/shared/formItems'
import { PayV2ProjectTxType } from 'hooks/v2/transactor/PayV2ProjectTx'
import { ethers, utils } from 'ethers'
import { weightedRate } from 'utils/math'

import V2ProjectRiskNotice from './V2ProjectRiskNotice'

export default function V2ConfirmPayOwnerModal({
  visible,
  weiAmount,
  onSuccess,
  onCancel,
  payProjectTx,
}: {
  visible?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
  payProjectTx: PayV2ProjectTxType
}) {
  const { userAddress } = useContext(NetworkContext)

  const [loading, setLoading] = useState<boolean>()
  const [preferClaimed, setPreferClaimed] = useState<boolean>(false)
  const [customBeneficiaryEnabled, setCustomBeneficiaryEnabled] =
    useState<boolean>(false)
  const [beneficiary, setBeneficiary] = useState<string | undefined>(
    userAddress,
  )

  const [form] = useForm<{ memo: string; beneficiary: string }>()
  const { fundingCycle, projectMetadata } = useContext(V2ProjectContext)
  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!weiAmount) return
    await form.validateFields()

    if (userAddress) {
      setLoading(true)
    }

    payProjectTx(
      {
        memo: form.getFieldValue('memo'),
        preferClaimedTokens: preferClaimed,
        beneficiary: beneficiary,
        value: weiAmount, //'0.001'),//BigNumber.from(0.01)//weiAmount,
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
    } else if (!utils.isAddress(beneficiary)) {
      return Promise.reject('Invalid address')
    }
    return Promise.resolve()
  }

  // TODO: reserved rate hardcoded to 0
  const receivedTickets = weightedRate(
    fundingCycle?.weight,
    0,
    weiAmount,
    'payer',
  ) // TODO: reserved rate hardcoded to 0
  const ownerTickets = weightedRate(
    fundingCycle?.weight,
    0,
    weiAmount,
    'reserved',
  )

  const hasIssuedTokens = true //tokenAddress && tokenAddress !== constants.AddressZero

  if (!projectMetadata) return null

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
            Paying {projectMetadata.name} is not an investment — it's a way to
            support the project. Any value or utility of the tokens you receive
            is determined by {projectMetadata.name}.
          </Trans>
        </p>

        {projectMetadata.payDisclosure && (
          <div>
            <h4>
              <Trans>Notice from {projectMetadata.name}:</Trans>
            </h4>
            <p>{projectMetadata.payDisclosure}</p>
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
          <FormItems.EthAddress
            defaultValue={''}
            name={'beneficiary'}
            onAddressChange={beneficiary => {
              setBeneficiary(beneficiary)
            }}
            disabled={!customBeneficiaryEnabled}
            formItemProps={{
              extra: t`Mint the new tokens to another address?`,
              label: (
                <div style={{ display: 'flex' }}>
                  <Trans>Custom token beneficiary</Trans>
                  <Switch
                    checked={customBeneficiaryEnabled}
                    onChange={setCustomBeneficiaryEnabled}
                    style={{ marginLeft: 10 }}
                  />
                </div>
              ),
              rules: [
                {
                  validator: validateCustomBeneficiary,
                },
              ],
            }}
          />
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
