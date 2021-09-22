import { InfoCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, Form, Input, Modal, Space, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useContext, useState } from 'react'

export default function IssueTickets({
  projectId,
}: {
  projectId: BigNumber | undefined
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [modalVisible, setModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<{ name: string; symbol: string }>()

  function issue() {
    if (!projectId || !transactor || !contracts) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    transactor(
      contracts.TicketBooth,
      'issue',
      [projectId.toHexString(), fields.name, fields.symbol],
      {
        onDone: () => setModalVisible(false),
      },
    )
  }

  return (
    <div>
      <Space>
        <Button loading={loading} onClick={() => setModalVisible(true)}>
          Issue ERC-20 token
        </Button>
        <Tooltip
          title="Issue an ERC-20 to be used as this project's token. Once
          issued, current staked token holders will be able to claim their
          balance in the new token."
        >
          <InfoCircleOutlined style={{ color: undefined }} />
        </Tooltip>
      </Space>

      <Modal
        visible={modalVisible}
        title="Issue ERC-20 token"
        okText="Issue token"
        onOk={issue}
        onCancel={() => setModalVisible(false)}
      >
        <p>
          Issue an ERC-20 token for this project. Once issued, current staked
          token holders will be able to claim their existing balance in the new
          token.
        </p>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Token name">
            <Input placeholder="Project Token" />
          </Form.Item>
          <Form.Item name="symbol" label="Token symbol">
            <Input
              placeholder="PRJ"
              onChange={e =>
                form.setFieldsValue({ symbol: e.target.value.toUpperCase() })
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
