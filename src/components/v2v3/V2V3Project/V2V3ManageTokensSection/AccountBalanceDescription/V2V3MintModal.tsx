import { t } from '@lingui/macro'
import { Form, Input, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { utils } from 'ethers'
import { useMintTokensTx } from 'hooks/v2v3/transactor/useMintTokensTx'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useContext, useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function V2V3MintModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { tokenSymbol } = useContext(V2V3ProjectContext)
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

    if (amount === '0' || !utils.isAddress(beneficiary)) return

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
        onError: (e: Error) => {
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

  const erc20Issued = useProjectHasErc20()

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
      open={open}
      title={t`Mint ${tokensTokenLower}`}
      onOk={executeMintTx}
      confirmLoading={loading}
      transactionPending={transactionPending}
      onCancel={onCancel}
      okText={t`Mint ${tokensTokenLower}`}
    >
      <p>Mint new tokens to a specified address.</p>

      <Form layout="vertical" form={form}>
        <Form.Item
          label={t`Token receiver`}
          name="beneficary"
          rules={[
            {
              required: true,
              validateTrigger: 'onCreate',
              validator: (rule, value) => {
                if (!value || !utils.isAddress(value))
                  return Promise.reject('Not a valid ETH address')
                else return Promise.resolve()
              },
            },
          ]}
        >
          <EthAddressInput />
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
        <Form.Item label="Memo" name="memo">
          <Input placeholder="Memo included on-chain (optional)" />
        </Form.Item>
        {erc20Issued && (
          <Form.Item
            name="preferClaimed"
            label={t`Mint as ERC-20`}
            valuePropName="checked"
            extra={t`When enabled, ${tokenSymbol} ERC-20 tokens are minted. When disabled, unclaimed ${tokenSymbol} tokens will be minted, which the receiver can claim later as ERC-20.`}
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        )}
      </Form>
    </TransactionModal>
  )
}
