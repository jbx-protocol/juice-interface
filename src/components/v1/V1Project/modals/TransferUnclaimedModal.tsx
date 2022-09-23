import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { isAddress } from 'ethers/lib/utils'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useTransferTokensTx } from 'hooks/v1/transactor/TransferTokensTx'

import { FC, useContext, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

interface TransferUnclaimedModalProps {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}

export const TransferUnclaimedModal: FC<TransferUnclaimedModalProps> = ({
  visible,
  onCancel,
  onConfirmed,
}) => {
  const unclaimedBalance = useUnclaimedBalanceOfUser()
  const { tokenSymbol } = useContext(V1ProjectContext)
  const [loading, setLoading] = useState<boolean>()
  const [form] = Form.useForm<{ amount: string; to: string }>()
  const transferUnclaimedTokensTx = useTransferTokensTx()

  const amount = useWatch('amount', form)
  const address = useWatch('to', form)

  const transferTokens = async () => {
    setLoading(true)

    transferUnclaimedTokensTx(
      {
        to: address,
        amount: parseWad(amount),
      },
      {
        onConfirmed: () => {
          form.resetFields()
          setLoading(false)
          onConfirmed?.()
        },
        onError: () => {
          setLoading(false)
        },
      },
    )
  }

  const tokenTextShort = tokenSymbolText({
    tokenSymbol,
    plural: true,
  })

  return (
    <Modal
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
    </Modal>
  )
}
