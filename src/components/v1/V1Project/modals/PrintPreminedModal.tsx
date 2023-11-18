import { Form, Input, Modal, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'

import { t, Trans } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { constants } from 'ethers'

import { isAddress } from 'ethers/lib/utils'
import { usePrintTokensTx } from 'hooks/v1/transactor/usePrintTokensTx'
import { useContext, useMemo, useState } from 'react'
import { parseWad } from 'utils/format/formatNumber'

import { RuleObject } from 'antd/lib/form'
import { StoreValue } from 'antd/lib/form/interface'
import { Callout } from 'components/Callout/Callout'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { OWNER_MINTING_EXPLANATION } from 'components/strings'
import { V1_CURRENCY_ETH } from 'constants/v1/currency'
import { isZeroAddress } from 'utils/address'

export default function PrintPreminedModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
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

  const [loading, setLoading] = useState<boolean>()

  async function mint() {
    await form.validateFields()
    const amount = form.getFieldValue('amount') ?? '0'
    const beneficiary = form.getFieldValue('beneficiary')
    if (!isAddress(beneficiary)) return

    setLoading(true)

    printTokensTx(
      {
        value: parseWad(amount),
        currency: V1_CURRENCY_ETH,
        beneficiary,
        memo: form.getFieldValue('memo'),
        preferUnstaked: form.getFieldValue('preferUnstaked'),
      },
      {
        onConfirmed: () => {
          form.resetFields()
          onConfirmed?.()
        },
        onDone: () => {
          setLoading(false)
        },
      },
    )
  }

  const amountValidator = (rule: RuleObject, value: StoreValue) => {
    if (!value || value === '0') {
      return Promise.reject(t`Amount required`)
    }
    return Promise.resolve()
  }

  const formItemProps: { label: string; extra: string } | undefined =
    useMemo(() => {
      if (!terminal?.version) return

      switch (terminal.version) {
        case '1':
          return {
            label: t`Payment equivalent`,
            extra: t`The amount of tokens minted to the receiver will be calculated as if they had paid this amount to the project in the current cycle.`,
          }
        case '1.1':
          return {
            label: t`Token amount`,
            extra: t`The amount of tokens to mint to the receiver.`,
          }
      }
    }, [terminal?.version])

  const erc20Issued = Boolean(tokenAddress && !isZeroAddress(tokenAddress))

  return (
    <Modal
      title={<Trans>Mint tokens</Trans>}
      open={open}
      onOk={() => form.submit()}
      confirmLoading={loading}
      onCancel={onCancel}
      okText={t`Mint tokens`}
    >
      <Callout.Info className="mb-5">
        <Trans>
          Owner token minting can be enabled or disabled by editing your cycle.{' '}
        </Trans>
        {OWNER_MINTING_EXPLANATION}
      </Callout.Info>

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
        <div className="mb-4">
          <Form.Item
            {...formItemProps}
            name="amount"
            required={true}
            rules={[{ validator: amountValidator }]}
          >
            <FormattedNumberInput
              accessory={
                terminal?.version === '1' ? (
                  <InputAccessoryButton content="ETH" />
                ) : undefined
              }
            />
          </Form.Item>
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
          label={<Trans>Issue as ERC-20</Trans>}
          valuePropName="checked"
          extra={
            erc20Issued
              ? t`When enabled, ${tokenSymbol} ERC-20 tokens are issued. When disabled, unclaimed ${tokenSymbol} tokens will be issued, which the receiver can claim later as ERC-20.`
              : t`ERC-20 tokens can only be issued once an ERC-20 token has been created for this project.`
          }
          initialValue={false}
        >
          <Switch disabled={!erc20Issued} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
