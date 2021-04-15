import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { useContext } from 'react'
import { formatWad, parsePerMille } from 'utils/formatCurrency'
import { weightedRate } from 'utils/math'

export default function ConfirmPayOwnerModal({
  projectId,
  project,
  fundingCycle,
  visible,
  usdAmount,
  onSuccess,
  onCancel,
}: {
  projectId: BigNumber
  project: ProjectIdentifier
  fundingCycle: FundingCycle | undefined
  visible?: boolean
  usdAmount: number | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const [form] = useForm<{ note: string }>()
  const { contracts, transactor, userAddress, weth } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const weiAmount = converter.usdToWei(usdAmount)

  async function pay() {
    if (!contracts || !projectId || !transactor) return

    await form.validateFields()

    transactor(
      contracts.Juicer,
      'pay',
      [
        projectId.toHexString(),
        weiAmount?.toHexString(),
        userAddress,
        form.getFieldValue('note') || '',
      ],
      {
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  const receivedTickets = weightedRate(
    fundingCycle,
    weiAmount,
    parsePerMille('100').sub(fundingCycle?.reserved ?? '0'),
  )

  const ownerTickets = weightedRate(
    fundingCycle,
    weiAmount,
    fundingCycle?.reserved,
  )

  return (
    <Modal
      title={'Pay ' + project?.name}
      visible={visible}
      onOk={pay}
      okText="Pay"
      onCancel={onCancel}
      width={800}
      centered={true}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Pay amount">
            {usdAmount} USD ({formatWad(weiAmount)} {weth?.symbol})
          </Descriptions.Item>
          <Descriptions.Item label="Tickets for you">
            {formatWad(receivedTickets)}
          </Descriptions.Item>
          <Descriptions.Item label="Tickets for owner">
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
