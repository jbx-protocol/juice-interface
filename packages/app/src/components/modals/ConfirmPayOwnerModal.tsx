import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext } from 'react'
import { currencyName } from 'utils/currency'
import { formattedNum, formatWad } from 'utils/formatNumber'
import { weightedRate } from 'utils/math'

export default function ConfirmPayOwnerModal({
  projectId,
  metadata,
  fundingCycle,
  visible,
  weiAmount,
  onSuccess,
  onCancel,
}: {
  projectId: BigNumber
  metadata: ProjectMetadata
  fundingCycle: FundingCycle | undefined
  visible?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const [form] = useForm<{ note: string }>()
  const { contracts, transactor, userAddress } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  async function pay() {
    if (!contracts || !projectId || !transactor) return

    await form.validateFields()

    transactor(
      contracts.Juicer,
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
      },
    )
  }

  const receivedTickets = weightedRate(fundingCycle, weiAmount, 'payer')
  const ownerTickets = weightedRate(fundingCycle, weiAmount, 'reserved')

  return (
    <Modal
      title={'Pay ' + metadata?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      width={800}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Pay amount" className="content-right">
            {formattedNum(usdAmount)} {currencyName(1)} ({formatWad(weiAmount)}{' '}
            {currencyName(0)})
          </Descriptions.Item>
          <Descriptions.Item label="Tickets for you" className="content-right">
            {formatWad(receivedTickets)}
          </Descriptions.Item>
          <Descriptions.Item label="Tickets reserved" className="content-right">
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
