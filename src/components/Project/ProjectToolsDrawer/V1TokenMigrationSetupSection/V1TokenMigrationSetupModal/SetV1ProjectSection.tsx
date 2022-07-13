import { Trans } from '@lingui/macro'
import { Button, Form, Input } from 'antd'
import { useCallback, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { useSetV1ProjectIdTx } from 'hooks/v2/transactor/SetV1ProjectIdTx'

import { StepSection } from './StepSection'

export function SetV1ProjectSection({
  completed,
  disabled,
  onCompleted,
}: {
  completed: boolean
  disabled: boolean
  onCompleted: VoidFunction
}) {
  const [form] = Form.useForm<{ v1ProjectId: number }>()
  const [v1ProjectIdLoading, setV1ProjectIdLoading] = useState<boolean>(false)

  const setV1ProjectIdTx = useSetV1ProjectIdTx()

  const onSetV1ProjectId = useCallback(async () => {
    setV1ProjectIdLoading(true)

    try {
      const result = await setV1ProjectIdTx(
        {
          v1ProjectId: parseInt(form.getFieldValue('v1ProjectId')),
        },
        {
          onConfirmed: () => {
            setV1ProjectIdLoading(false)
            onCompleted()
          },
        },
      )
      if (!result) throw new Error()
    } catch (e) {
      emitErrorNotification('Error adding migration terminal.')
      setV1ProjectIdLoading(false)
    }
  }, [setV1ProjectIdTx, form, onCompleted])

  return (
    <StepSection
      title={<Trans>Step 2. Link your Juicebox V1 project</Trans>}
      completed={completed}
    >
      <p>
        <Trans>
          Configure which Juicebox V1 project you'd like to accept tokens for.
          Token holders of this V1 project will be able to swap their V1 tokens
          for V2 tokens.
        </Trans>
      </p>

      <Form layout="vertical" form={form} onFinish={onSetV1ProjectId}>
        <Form.Item
          name="v1ProjectId"
          label={<Trans>Juicebox V1 project ID</Trans>}
          extra={<Trans>You must own this V1 project.</Trans>}
          required
        >
          <Input placeholder="1" type="number" />
        </Form.Item>

        <Button
          type="primary"
          size="small"
          disabled={disabled}
          loading={v1ProjectIdLoading}
          htmlType="submit"
        >
          <span>
            <Trans>Link Juicebox V1 project</Trans>
          </span>
        </Button>
      </Form>
    </StepSection>
  )
}
