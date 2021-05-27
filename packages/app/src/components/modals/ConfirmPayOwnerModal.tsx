import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { useContext } from 'react'
import { currencyName } from 'utils/currency'
import { formattedNum, formatWad } from 'utils/formatCurrency'
import { weightedRate } from 'utils/math'

export default function ConfirmPayOwnerModal({
  projectId,
  project,
  fundingCycle,
  visible,
  weiAmount,
  onSuccess,
  onCancel,
}: {
  projectId: BigNumber
  project: ProjectIdentifier
  fundingCycle: FundingCycle | undefined
  visible?: boolean
  weiAmount: BigNumber | undefined
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const [form] = useForm<{ note: string }>()
  const metadata = useProjectMetadata(project.link)
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

  const currencyWad =
    fundingCycle?.currency === 0 ? weiAmount : converter.weiToUsd(weiAmount)
  const receivedTickets = weightedRate(fundingCycle, currencyWad, 'payer')
  const ownerTickets = weightedRate(fundingCycle, currencyWad, 'reserved')

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
