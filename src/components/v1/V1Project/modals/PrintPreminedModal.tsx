import { Form, Input, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { constants, utils } from 'ethers'
import { usePrintTokensTx } from 'hooks/v1/transactor/PrintTokensTx'
import { useContext, useMemo, useState } from 'react'
import { parseWad } from 'utils/formatNumber'

import { V1_CURRENCY_ETH } from 'constants/v1/currency'

export default function PrintPreminedModal({
  visible,
  onCancel,
}: {
  visible: boolean | undefined
  onCancel: VoidFunction
}) {
  const { tokenSymbol, tokenAddress, terminal } = useContext(V1ProjectContext)
  const printTokensTx = usePrintTokensTx()
  const [form] = useForm<{
    beneficary: string
    preferUnstaked: boolean
    memo: string
  }>()

  const [value, setValue] = useState<string>('0')
  const [loading, setLoading] = useState<boolean>()

  async function mint() {
    const beneficiary = form.getFieldValue('beneficary')
    if (!utils.isAddress(beneficiary)) return

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
          if (onCancel) onCancel()
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

      switch (terminal.version) {
        case '1':
          return {
            label: 'Payment equivalent',
            extra:
              'The amount of tokens minted to the receiver will be calculated based on if they had paid this amount to the project in the current funding cycle.',
          }
        case '1.1':
          return {
            label: 'Token amount',
            extra: 'The amount of tokens to mint to the receiver.',
          }
      }
    }, [terminal?.version])

  const erc20Issued =
    tokenSymbol && tokenAddress && tokenAddress !== constants.AddressZero

  return (
    <Modal
      visible={visible}
      onOk={mint}
      confirmLoading={loading}
      onCancel={onCancel}
      okText="Mint tokens"
    >
      <div style={{ marginBottom: 20 }}>
        Note: Tokens can be minted manually when allowed in the current funding
        cycle. This can be changed by the project owner for upcoming cycles.
      </div>

      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tokens receiver"
          name="beneficary"
          rules={[
            {
              required: true,
              validator: (rule, value) => {
                if (!value || !utils.isAddress(value))
                  return Promise.reject('Not a valid ETH address')
                else return Promise.resolve()
              },
            },
          ]}
        >
          <Input placeholder={constants.AddressZero} />
        </Form.Item>
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
        <Form.Item label="Memo" name="memo">
          <Input placeholder="Memo included on-chain (optional)" />
        </Form.Item>
        <Form.Item
          name="preferUnstaked"
          label="Mint as ERC-20"
          valuePropName="checked"
          extra={
            erc20Issued
              ? `Enabling this will mint ${tokenSymbol} ERC-20 tokens. Otherwise staked ${tokenSymbol} tokens will be minted, which can be claimed later as ERC-20 by the receiver.`
              : 'ERC-20 tokens can only be minted once an ERC-20 token has been issued for this project.'
          }
          initialValue={false}
        >
          <Switch disabled={!erc20Issued} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
