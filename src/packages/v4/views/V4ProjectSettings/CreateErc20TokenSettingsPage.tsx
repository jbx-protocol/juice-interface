import { Trans, t } from '@lingui/macro'
import { Button, Form, Input } from 'antd'
import { IssueErc20TokenTxArgs } from 'components/buttons/IssueErc20TokenButton'
import TransactionModal from 'components/modals/TransactionModal'
import { ISSUE_ERC20_EXPLANATION } from 'components/strings'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { useV4IssueErc20TokenTx } from 'packages/v4/hooks/useV4IssueErc20TokenTx'
import { useV4WalletHasPermission } from 'packages/v4/hooks/useV4WalletHasPermission'
import { V4OperatorPermission } from 'packages/v4/models/v4Permissions'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

export function CreateErc20TokenSettingsPage() {
  const [form] = Form.useForm<IssueErc20TokenTxArgs>()
  const [loading, setLoading] = useState<boolean>()
  const [transactionModalOpen, setTransactionModalOpen] =
    useState<boolean>(false)
  const [transactionPending, setTransactionPending] = useState<boolean>(false)
const issueErc20TokenTx = useV4IssueErc20TokenTx()
  const projectHasErc20Token = useProjectHasErc20Token()
  const hasIssueTicketsPermission = useV4WalletHasPermission(
    V4OperatorPermission.DEPLOY_ERC20,
  )

  const canCreateErc20Token = !projectHasErc20Token && hasIssueTicketsPermission

  async function onIssueErc20FormSaved(values: IssueErc20TokenTxArgs) {
    await form.validateFields()

    if (!issueErc20TokenTx) {
      emitErrorNotification(t`ERC20 transaction not ready. Try again.`)
      return
    }

    setLoading(true)

    issueErc20TokenTx(
      { name: values.name, symbol: values.symbol },
      {
        onTransactionPending: () => {
          setTransactionPending(true)
          setTransactionModalOpen(true)
        },
        onTransactionConfirmed: () => {
          setTransactionPending(false)
          setTransactionModalOpen(false)
          setLoading(false)
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        },
        onTransactionError: (e: Error) => {
          setTransactionPending(false)
          setTransactionModalOpen(false)
          setLoading(false)
          emitErrorNotification(e.message)
          emitErrorNotification(
            t`Failed to create ERC20 token: ${e.message}`,
          )
        },
      },
    )
  }

  if (!canCreateErc20Token) {
    return (
      <div>
        <p>
          Token is already created or you do not have permission to create it.
        </p>
      </div>
    )
  }

  return (
    <>
      <p>{ISSUE_ERC20_EXPLANATION}</p>
      <Form
        className="mt-5 w-full md:max-w-sm"
        form={form}
        onFinish={onIssueErc20FormSaved}
      >
        <Form.Item
          name="name"
          label={t`Token name`}
          rules={[{ required: true, message: t`Token name is required` }]}
        >
          <Input placeholder={t`Project Token`} />
        </Form.Item>
        <Form.Item
          name="symbol"
          label={t`Token ticker`}
          rules={[{ required: true, message: t`Token ticker is required` }]}
        >
          <Input
            placeholder="PRJ"
            onChange={e =>
              form.setFieldsValue({ symbol: e.target.value.toUpperCase() })
            }
          />
        </Form.Item>
        <Button
          className="mt-3"
          htmlType="submit"
          loading={loading}
          type="primary"
        >
          <span>
            <Trans>Create ERC-20 Token</Trans>
          </span>
        </Button>
      </Form>

      <TransactionModal
        transactionPending={transactionPending}
        title={t`Create ERC-20 Token`}
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        onOk={() => setTransactionModalOpen(false)}
        confirmLoading={loading}
        centered
      />
    </>
  )
}
