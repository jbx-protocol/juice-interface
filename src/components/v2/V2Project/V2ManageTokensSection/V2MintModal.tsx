import { Form, Input, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { isAddress } from '@ethersproject/address'
import * as constants from '@ethersproject/constants'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'

import { t, Trans } from '@lingui/macro'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/TransactionModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useMintTokensTx } from 'hooks/v2/transactor/MintTokensTx'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function V2MintModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { tokenSymbol, tokenAddress } = useContext(V2ProjectContext)
  const mintTokensTx = useMintTokensTx()
  const [form] = useForm<{
    beneficary: string
    preferClaimed: boolean
    memo: string
  }>()

  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const executeMintTx = async () => {
    await form.validateFields()

    const amount = form.getFieldValue('amount') ?? '0'
    const beneficiary = form.getFieldValue('beneficary')

    if (amount === '0' || !isAddress(beneficiary)) return

    setLoading(true)

    const txSuccess = await mintTokensTx(
      {
        value: parseWad(amount),
        beneficiary,
        preferClaimed: form.getFieldValue('preferClaimed'),
        memo: form.getFieldValue('memo'),
      },
      {
        onDone: () => {
          setTransactionPending(true)
          setLoading(false)
        },
        onConfirmed: () => {
          form.resetFields()
          setTransactionPending(false)
          onConfirmed?.()
        },
        onError: (e: DOMException) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      setTransactionPending(false)
      setLoading(false)
    }
  }

  const erc20Issued =
    tokenSymbol && tokenAddress && tokenAddress !== constants.AddressZero

  const tokensTokenLower = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  const tokensTokenUpper = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: false,
  })

  return (
    <TransactionModal
      visible={visible}
      title={t`Mint ${tokensTokenLower}`}
      onOk={executeMintTx}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      okText={t`Mint ${tokensTokenLower}`}
    >
      <div style={{ marginBottom: 20 }}>
        <Trans>
          Note: Tokens can be minted manually when allowed in the current
          funding cycle. This can be changed by the project owner for upcoming
          cycles.
        </Trans>
      </div>

      <Form layout="vertical" form={form}>
        <Form.Item
          label={t`Tokens receiver`}
          name="beneficary"
          rules={[
            {
              required: true,
              validateTrigger: 'onCreate',
              validator: (rule, value) => {
                if (!value || !isAddress(value))
                  return Promise.reject('Not a valid ETH address')
                else return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder={constants.AddressZero} />
        </Form.Item>
        <Form.Item
          name="amount"
          label={t`${tokensTokenUpper} amount`}
          extra={t`The amount of tokens to mint to the receiver.`}
          rules={[
            {
              required: true,
              validateTrigger: 'onCreate',
              validator: (rule, value) => {
                if (!value || value === '0') {
                  return Promise.reject('Invalid value')
                }
                return Promise.resolve()
              },
            },
          ]}
          required
        >
          <FormattedNumberInput placeholder="0" />
        </Form.Item>
        <br />
        <Form.Item label="Memo" name="memo">
          <Input placeholder="Memo included on-chain (optional)" />
        </Form.Item>
        <Form.Item
          name="preferClaimed"
          label={t`Mint as ERC-20`}
          valuePropName="checked"
          extra={
            erc20Issued
              ? t`Enabling this will mint ${tokenSymbol} ERC-20 tokens. Otherwise, unclaimed ${tokenSymbol} tokens will be minted, which can be claimed later as ERC-20 by the receiver.`
              : t`ERC-20 tokens can only be minted once an ERC-20 token has been issued for this project.`
          }
          initialValue={false}
        >
          <Switch disabled={!erc20Issued} />
        </Form.Item>
      </Form>
    </TransactionModal>
  )
}
