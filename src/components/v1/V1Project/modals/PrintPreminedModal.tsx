import { Form, Input, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { isAddress } from '@ethersproject/address'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import Callout from 'components/Callout'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { usePrintTokensTx } from 'hooks/v1/transactor/PrintTokensTx'
import { useContext, useMemo, useState } from 'react'
import { parseWad } from 'utils/formatNumber'

import { V1_CURRENCY_ETH } from 'constants/v1/currency'

export default function PrintPreminedModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const { tokenSymbol, tokenAddress, terminal } = useContext(V1ProjectContext)
  const printTokensTx = usePrintTokensTx()
  const [form] = useForm<{
    beneficiary: string
    amount: string
    preferUnstaked: boolean
    memo: string
  }>()

  const [value, setValue] = useState<string>('0')
  const [loading, setLoading] = useState<boolean>()

  async function mint() {
    const beneficiary = form.getFieldValue('beneficiary')
    if (!isAddress(beneficiary)) return

    setLoading(true)

    await form.validateFields()

    printTokensTx(
      {
        value: parseWad(value),
        currency: V1_CURRENCY_ETH,
        beneficiary,
        memo: form.getFieldValue('memo'),
        preferUnstaked: form.getFieldValue('preferUnstaked'),
      },
      {
        onConfirmed: () => {
          form.resetFields()
          setValue('0')
          onConfirmed?.()
        },
        onDone: () => {
          setLoading(false)
        },
      },
    )
  }

  const formItemProps: { label: string; extra: string } | undefined =
    useMemo(() => {
      if (!terminal?.version) return

      const amountValidator = () => {
        if (!value || value === '0') {
          return Promise.reject(t`Amount required`)
        }
        return Promise.resolve()
      }

      switch (terminal.version) {
        case '1':
          return {
            label: t`Payment equivalent`,
            name: 'amount',
            extra: t`The amount of tokens minted to the receiver will be calculated based on if they had paid this amount to the project in the current funding cycle.`,
            required: true,
            rules: [{ validator: amountValidator }],
          }
        case '1.1':
          return {
            label: t`Token amount`,
            name: 'amount',
            extra: t`The amount of tokens to mint to the receiver.`,
            required: true,
            rules: [{ validator: amountValidator }],
          }
      }
    }, [terminal?.version, value])

  const erc20Issued =
    tokenSymbol && tokenAddress && tokenAddress !== constants.AddressZero

  return (
    <Modal
      title={<Trans>Mint tokens</Trans>}
      visible={visible}
      onOk={() => form.submit()}
      confirmLoading={loading}
      onCancel={onCancel}
      okText={t`Mint tokens`}
    >
      <Callout style={{ marginBottom: 20 }}>
        <Trans>
          Tokens can be minted manually when allowed in the current funding
          cycle. The project owner can enable or disable minting for upcoming
          cycles.
        </Trans>
      </Callout>

      <Form layout="vertical" form={form} onFinish={mint}>
        <Form.Item
          label={<Trans>Tokens receiver</Trans>}
          name="beneficiary"
          rules={[
            {
              required: true,
              validator: (rule, value) => {
                if (!value || !isAddress(value))
                  return Promise.reject(t`Not a valid ETH address`)
                else return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder={constants.AddressZero} />
        </Form.Item>
        <div style={{ marginBottom: '1rem' }}>
          <FormattedNumberInput
            formItemProps={formItemProps}
            value={value}
            onChange={val => setValue(val ?? '0')}
            accessory={
              terminal?.version === '1' ? (
                <InputAccessoryButton content="ETH" />
              ) : undefined
            }
          />
        </div>
        <Form.Item
          label={<Trans>Memo</Trans>}
          name="memo"
          extra={<Trans>Memo included on-chain</Trans>}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="preferUnstaked"
          label={<Trans>Mint as ERC-20</Trans>}
          valuePropName="checked"
          extra={
            erc20Issued
              ? t`Enabling this will mint ${tokenSymbol} ERC-20 tokens. Otherwise unclaimed ${tokenSymbol} tokens will be minted, which can be claimed later as ERC-20 by the receiver.`
              : t`ERC-20 tokens can only be minted once an ERC-20 token has been issued for this project.`
          }
          initialValue={false}
        >
          <Switch disabled={!erc20Issued} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
