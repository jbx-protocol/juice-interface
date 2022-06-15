import { Trans } from '@lingui/macro'
import { Button, Form, Input } from 'antd'
import { useCallback, useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { getAddress } from '@ethersproject/address'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useSetV1ProjectIdTx } from 'hooks/v2/transactor/SetV1ProjectIdTx'
import { useV1ProjectOf } from 'hooks/v2/contractReader/V1ProjectOf'

import { StepSection } from './StepSection'
import { JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS } from 'constants/contracts'
import { readNetwork } from 'constants/networks'

const hasV1TokenPaymentTerminal = (
  terminals: string[] | undefined,
): boolean => {
  if (!terminals) return false

  const terminalAddress = JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]
  if (!terminalAddress) return false

  return Boolean(
    terminalAddress && terminals.includes(getAddress(terminalAddress)),
  )
}

export function SetV1ProjectSection() {
  const [form] = Form.useForm<{ v1ProjectId: number }>()

  const { terminals, projectId } = useContext(V2ProjectContext)

  const setV1ProjectIdTx = useSetV1ProjectIdTx()
  const { data: v1Project } = useV1ProjectOf(projectId)
  const hasSetV1Project = Boolean(v1Project?.toNumber())

  const [v1ProjectIdLoading, setV1ProjectIdLoading] = useState<boolean>(false)

  const hasMigrationTerminal = hasV1TokenPaymentTerminal(terminals)

  const onSetV1ProjectId = useCallback(async () => {
    setV1ProjectIdLoading(true)

    try {
      const result = await setV1ProjectIdTx({
        v1ProjectId: parseInt(form.getFieldValue('v1ProjectId')),
      })
      if (!result) throw new Error()
    } catch (e) {
      emitErrorNotification('Error adding migration terminal.')
    } finally {
      setV1ProjectIdLoading(false)
    }
  }, [setV1ProjectIdTx, form])

  return (
    <StepSection
      title={<Trans>Step 2. Link your Juicebox V1 project</Trans>}
      completed={hasSetV1Project}
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
          disabled={!hasMigrationTerminal}
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
