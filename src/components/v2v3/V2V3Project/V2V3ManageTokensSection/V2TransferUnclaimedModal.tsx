import { t, Trans } from '@lingui/macro'
import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/TransactionModal'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { isAddress } from 'ethers/lib/utils'
import useUserUnclaimedTokenBalance from 'hooks/v2v3/contractReader/UserUnclaimedTokenBalance'
import { useTransferUnclaimedTokensTx } from 'hooks/v2v3/transactor/TransferUnclaimedTokensTx'

import { FC, useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { tokenSymbolText } from 'utils/tokenSymbolText'

interface V2TransferUnclaimedTokensModalProps {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}

export const V2TransferUnclaimedTokensModal: FC<
  V2TransferUnclaimedTokensModalProps
> = ({ visible, onCancel, onConfirmed }) => {
  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const [loading, setLoading] = useState<boolean>()
  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [form] = Form.useForm<{ amount: string; to: string }>()
  const transferUnclaimedTokensTx = useTransferUnclaimedTokensTx()

  const amount = useWatch('amount', form)
  const address = useWatch('to', form)

  const transferTokens = async () => {
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
        form.setFieldsValue({
          amount: undefined,
          to: undefined,
        })
        onCancel?.()
      }}
      okText={t`Transfer ${tokenTextShort}`}
      okButtonProps={{
        disabled: parseWad(amount).eq(0) || !isAddress(address),
      }}
      centered
    >
      <Form form={form} layout="vertical">
        <p>
          <Trans>
            Your unclaimed token balance:{' '}
            {formatWad(unclaimedBalance, { precision: 0 })}
          </Trans>
        </p>
        <Form.Item name="amount" label="Amount">
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
        <Form.Item name="to" label={t`Recipient address`}>
          <EthAddressInput />
        </Form.Item>
      </Form>
    </TransactionModal>
  )
}
