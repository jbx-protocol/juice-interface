import { Button, Form, Input, Space, Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'
import { useForm } from 'antd/lib/form/Form'
import { useState } from 'react'
import { TransactorInstance } from 'hooks/Transactor'
import { useHistory } from 'react-router-dom'
import { SettingOutlined } from '@ant-design/icons'

import TransactionModal from './TransactionModal'

export default function IssueTicketsButton({
  useIssueTokensTx,
  isNewDeploy,
}: {
  useIssueTokensTx: () => TransactorInstance<{
    name: string
    symbol: string
  }>
  isNewDeploy?: boolean
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(
    Boolean(isNewDeploy),
  )
  const [transactionPending, setTransactionPending] = useState<boolean>()
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
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setModalVisible(false)
          setTransactionPending(false)
          setLoading(false)
          // refresh page
          history.go(0)
        },
      },
    )
  }

  function IssueTokensButton() {
    return (
      <Tooltip
        title={
          <Trans>
            Issue an ERC-20 to be used as this project's token. Once issued,
            anyone can claim their existing token balance in the new token.
          </Trans>
        }
      >
        <Button
          size="small"
          icon={<SettingOutlined />}
          loading={loading}
          onClick={() => setModalVisible(true)}
        >
          <span>
            <Trans>Issue ERC-20</Trans>
          </span>
        </Button>
      </Tooltip>
    )
  }

  return (
    <div>
      <Space>
        <IssueTokensButton />
      </Space>

      <TransactionModal
        visible={modalVisible}
        title={t`Issue ERC-20 token`}
        okText={t`Issue token`}
        cancelText={t`Later`}
        onOk={issue}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        transactionPending={transactionPending}
      >
        <p>
          {!Boolean(isNewDeploy) ? (
            <Trans>
              Issue an ERC-20 to be used as this project's token. Once issued,
              anyone can claim their existing token balance in the new token.
            </Trans>
          ) : (
            <Trans>
              Would you to issue an ERC-20 token to be used as this project's
              token?
            </Trans>
          )}
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
      </TransactionModal>
    </div>
  )
}
