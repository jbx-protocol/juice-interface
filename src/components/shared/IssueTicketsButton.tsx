import { Button, Form, Input, Modal, Space } from 'antd'
import { t, Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import TooltipIcon from 'components/shared/TooltipIcon'
import { useState } from 'react'
import { TransactorInstance } from 'hooks/Transactor'
import { useHistory } from 'react-router-dom'
import { SettingOutlined } from '@ant-design/icons'

export default function IssueTicketsButton({
  useIssueTokensTx,
}: {
  useIssueTokensTx: () => TransactorInstance<{
    name: string
    symbol: string
  }>
}) {
  const [modalVisible, setModalVisible] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<{ name: string; symbol: string }>()

  const history = useHistory()

  const issueTokensTx = useIssueTokensTx()

  function issue() {
    setLoading(true)

    const fields = form.getFieldsValue(true)

    issueTokensTx(
      { name: fields.name, symbol: fields.symbol },
      {
        onDone: () => setModalVisible(false),
        onConfirmed: () => {
          history.go(0)
          setLoading(false)
        },
      },
    )
  }

  return (
    <div>
      <Space>
        <Button
          size="small"
          icon={<SettingOutlined />}
          loading={loading}
          onClick={() => setModalVisible(true)}
        >
          <span>
            <Trans>Issue ERC-20 token</Trans>
          </span>
        </Button>
        <TooltipIcon
          iconStyle={{ fontSize: '.8rem' }}
          tip={
            <Trans>
              Issue an ERC-20 to be used as this project's token. Once issued,
              anyone can claim their existing token balance in the new token.
            </Trans>
          }
        />
      </Space>

      <Modal
        visible={modalVisible}
        title={t`Issue ERC-20 token`}
        okText={t`Issue token`}
        onOk={issue}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <p>
          <Trans>
            Issue an ERC-20 token for this project. Once issued, anyone can
            claim their existing token balance in the new token.
          </Trans>
        </p>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t`Token name`}>
            <Input placeholder={t`Project Token`} />
          </Form.Item>
          <Form.Item name="symbol" label={t`Token symbol`}>
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
