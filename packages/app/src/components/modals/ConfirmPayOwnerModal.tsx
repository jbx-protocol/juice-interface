import { BigNumber } from '@ethersproject/bignumber'
import { Descriptions, Form, Input, Modal, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { FundingCycle } from 'models/funding-cycle'
import { ProjectIdentifier } from 'models/project-identifier'
import { useContext } from 'react'
import { currencyName } from 'utils/currency'
import { formattedNum, formatWad, parsePerMille } from 'utils/formatCurrency'
import { weightedRate } from 'utils/math'

import { decodeFCMetadata } from '../../utils/fundingCycle'

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
  const { contracts, transactor, userAddress } = useContext(UserContext)

  const converter = useCurrencyConverter()

  const usdAmount = converter.weiToUsd(weiAmount)

  const metadata = decodeFCMetadata(fundingCycle?.metadata)

  async function pay() {
    if (!contracts || !projectId || !transactor) return

    await form.validateFields()

    transactor(
      contracts.Juicer,
      'pay',
      [projectId.toHexString(), userAddress, form.getFieldValue('note') || ''],
      {
        value: weiAmount?.toHexString(),
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  const receivedTickets = weightedRate(
    fundingCycle,
    weiAmount,
    parsePerMille('100').sub(metadata?.reserved ?? 0),
  )

  const ownerTickets =
    metadata &&
    weightedRate(fundingCycle, weiAmount, BigNumber.from(metadata.reserved))

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
            {formattedNum(usdAmount)} {currencyName(1)} ({formatWad(weiAmount)}{' '}
            {currencyName(0)})
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
