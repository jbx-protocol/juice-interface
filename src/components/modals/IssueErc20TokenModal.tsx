import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ISSUE_ERC20_EXPLANATION } from 'components/strings'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

import { useJBChainId } from 'juice-sdk-react'
import { useIssueErc20TokenTx } from 'hooks/useIssueErc20TokenTx'
import { IssueErc20TokenTxArgs } from '../buttons/IssueErc20TokenButton'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'
import TransactionModal from './TransactionModal'

export function IssueErc20TokenModal({
  open,
  onClose,
  onConfirmed,
}: {
  open: boolean
  onClose: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const router = useRouter()
  const chainId = useJBChainId()
  const { version } = useV4V5Version()
  const { jbUrn } = router.query

  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [erc20SuccessModalOpen, setErc20SuccessModalOpen] = useState<boolean>(false)
  const [form] = useForm<IssueErc20TokenTxArgs>()

  const issueErc20TokenTx = useIssueErc20TokenTx()

  async function executeErc20IssueTokenTx() {
    await form.validateFields()

    if (!issueErc20TokenTx) {
      emitErrorNotification(t`ERC20 transaction not ready. Try again.`)
      return
    }

    setLoading(true)

    const fields = form.getFieldsValue(true)

    const txSuccess = await issueErc20TokenTx(
      { name: fields.name, symbol: fields.symbol },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setTransactionPending(false)
          setLoading(false)
          setErc20SuccessModalOpen(true) // Show success modal instead of closing
        },
        onError: (e: Error) => {
          setTransactionPending(false)
          setLoading(false)
          emitErrorNotification(e.message)
        },
      },
    )

    if (!txSuccess) {
      emitErrorNotification(
        t`Failed to create ERC20 token. Check transaction and try again.`,
      )

      setLoading(false)
      setTransactionPending(false)
    }
  }

  const checkIconWithBackground = (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-melon-100 dark:bg-melon-950">
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-melon-200 dark:bg-melon-900">
        <CheckCircleIcon className="h-10 w-10 text-melon-700 dark:text-melon-500" />
      </div>
    </div>
  )

  return (
    <>
      <TransactionModal
        open={open}
        title={t`Create ERC-20 token`}
        okText={t`Create token`}
        cancelText={t`Later`}
        connectWalletText={t`Connect wallet to create`}
        onOk={executeErc20IssueTokenTx}
        onCancel={() => onClose()}
        confirmLoading={loading}
        transactionPending={transactionPending}
      >
        <p>{ISSUE_ERC20_EXPLANATION}</p>
        <Form form={form} layout="vertical">
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
        </Form>
      </TransactionModal>

      <Modal
        open={erc20SuccessModalOpen}
        onCancel={() => {
          setErc20SuccessModalOpen(false)
          onClose()
          onConfirmed?.()
        }}
        footer={null}
      >
        <div className="flex w-full flex-col items-center gap-4 pt-2 text-center">
          {checkIconWithBackground}
          <div className="w-80 pt-1 text-2xl font-medium">
            <Trans>Congrats! Your ERC-20 token has been created</Trans>
          </div>
          <div className="text-secondary pb-6">
            <Trans>
              Token holders can now claim their tokens as ERC-20.
            </Trans>
          </div>
          <Button
            type="primary"
            className="w-[185px] h-12"
            onClick={() => {
              setErc20SuccessModalOpen(false)
              onClose()

              // Navigate to project tokens tab instead of calling onConfirmed (which causes reload)
              if (jbUrn && chainId) {
                router.push(`/v${version}/${jbUrn}?tabid=tokens`)
              }
            }}
          >
            <Trans>Back to project</Trans>
          </Button>
        </div>
      </Modal>
    </>
  )
}
