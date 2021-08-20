import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formattedNum, formatWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'

export default function ConfirmPayOwnerModal({
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
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<{ note: string }>()
  const { contracts, transactor, userAddress } = useContext(UserContext)
  const { tokenSymbol, currentFC, projectId, metadata } =
    useContext(ProjectContext)

  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!contracts || !projectId || !transactor) return

    await form.validateFields()

    setLoading(true)

    transactor(
      contracts.TerminalV1,
      'pay',
      [
        projectId.toHexString(),
        userAddress,
        form.getFieldValue('note') || '',
        false,
      ],
      {
        value: weiAmount?.toHexString(),
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
        onDone: () => setLoading(false),
      },
    )
  }

  const receivedTickets = weightedRate(currentFC, weiAmount, 'payer')
  const ownerTickets = weightedRate(currentFC, weiAmount, 'reserved')

  return (
    <Modal
      title={'Pay ' + metadata?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      confirmLoading={loading}
      width={800}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Pay amount" className="content-right">
            {formattedNum(usdAmount)} {currencyName(1)} ({formatWad(weiAmount)}{' '}
            {currencyName(0)})
          </Descriptions.Item>
          <Descriptions.Item
            label={(tokenSymbol ?? 'Tokens') + ' for you'}
            className="content-right"
          >
            <div>{formatWad(receivedTickets)}</div>
            <div>
              To: <FormattedAddress address={userAddress} />
            </div>
          </Descriptions.Item>
          <Descriptions.Item
            label={(tokenSymbol ?? 'Tokens') + ' reserved'}
            className="content-right"
          >
            {formatWad(ownerTickets)}
          </Descriptions.Item>
        </Descriptions>
        <Form form={form}>
          <Form.Item label="Memo" name="note" rules={[{ max: 256 }]}>
            <Input.TextArea
              placeholder="Add a note to this payment on-chain (optional)."
              maxLength={256}
              showCount
              autoSize
            />
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  )
}
