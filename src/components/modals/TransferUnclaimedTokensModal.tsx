import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/TransactionModal'
import { isAddress } from 'ethers/lib/utils'
import { TransactorInstance } from 'hooks/Transactor'
import { useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function TransferUnclaimedTokensModal({
  visible,
  onCancel,
  onConfirmed,
  tokenSymbol,
  unclaimedBalance,
  useTransferUnclaimedTokensTx,
}: {
  visible: boolean
  onCancel: VoidFunction
  onConfirmed: VoidFunction
  tokenSymbol: string | undefined
  unclaimedBalance: BigNumber | undefined
  useTransferUnclaimedTokensTx: () => TransactorInstance<{
    to: string
    amount: BigNumber
  }>
}) {
  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [form] = Form.useForm<{ amount: string; to: string }>()
  const amount = useWatch('amount', form)
  const address = useWatch('to', form)
  const transferUnclaimedTokensTx = useTransferUnclaimedTokensTx()

  const transferTokens = async () => {
    await form.validateFields()

    setLoading(true)

    const txSuccess = await transferUnclaimedTokensTx(
      {
        to: address,
        amount: parseWad(amount),
      },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          form.resetFields()
          setTransactionPending(false)
          setLoading(false)
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

  const validateAmount = () => {
    if (parseWad(amount).eq(0)) {
      return Promise.reject(t`Amount is required.`)
    }
    return Promise.resolve()
  }

  const validateAddress = () => {
    if (!isAddress(address)) {
      return Promise.reject(t`Recipient address is required.`)
    }
    return Promise.resolve()
  }

  const tokenTextShort = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  return (
    <TransactionModal
      transactionPending={transactionPending}
      title={t`Transfer unclaimed ${tokenTextShort}`}
      visible={visible}
      confirmLoading={loading}
      onOk={() => {
        transferTokens()
      }}
      onCancel={() => {
        form.resetFields()
        onCancel?.()
      }}
      okText={t`Transfer ${tokenTextShort}`}
      centered
    >
      <Form form={form} layout="vertical">
        <p>
          <Trans>
            Your unclaimed token balance:{' '}
            {formatWad(unclaimedBalance, { precision: 0 })}
          </Trans>
        </p>
        <Form.Item
          name="amount"
          label={t`Amount`}
          rules={[
            {
              validator: validateAmount,
            },
          ]}
        >
          <FormattedNumberInput
            placeholder="0"
            min={0}
            max={parseFloat(fromWad(unclaimedBalance))}
            accessory={
              <InputAccessoryButton
                content={<Trans>MAX</Trans>}
                onClick={() =>
                  form.setFieldsValue({
                    amount: fromWad(unclaimedBalance),
                  })
                }
              />
            }
          />
        </Form.Item>
        <Form.Item
          name="to"
          label={t`Recipient address`}
          rules={[
            {
              validator: validateAddress,
            },
          ]}
        >
          <EthAddressInput />
        </Form.Item>
      </Form>
    </TransactionModal>
  )
}
