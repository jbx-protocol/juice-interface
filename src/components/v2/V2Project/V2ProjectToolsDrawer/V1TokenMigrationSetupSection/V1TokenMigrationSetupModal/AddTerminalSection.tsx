import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useSetProjectTerminalsTx } from 'hooks/v2/transactor/SetProjectTerminalsTx'
import { useCallback, useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

import { StepSection } from './StepSection'

export function AddTerminalSection({
  completed,
  onCompleted,
}: {
  completed: boolean
  onCompleted: VoidFunction
}) {
  const { contracts } = useContext(V2UserContext)
  const [addTerminalLoading, setAddTerminalLoading] = useState<boolean>(false)
  const setProjectTerminalsTx = useSetProjectTerminalsTx()
  const { terminals } = useContext(V2ProjectContext)

  const onAddTerminal = useCallback(async () => {
    setAddTerminalLoading(true)

    if (!contracts) return

    const newTerminals = [
      ...(terminals || []),
      contracts.JBV1TokenPaymentTerminal.address,
    ]
    try {
      const result = await setProjectTerminalsTx(
        { terminals: newTerminals },
        {
          onConfirmed: () => {
            setAddTerminalLoading(false)
            onCompleted()
          },
        },
      )
      if (!result) throw new Error('Transaction failed.')
    } catch (e) {
      emitErrorNotification('Error adding migration terminal.')
      setAddTerminalLoading(false)
    }
  }, [terminals, setProjectTerminalsTx, onCompleted, contracts])

  return (
    <StepSection
      title={<Trans>Step 1. Add V1 token payment terminal</Trans>}
      completed={completed}
    >
      <p>
        <Trans>Add the V1 Token Payment Terminal to your project.</Trans>
      </p>
      <div style={{ marginBottom: '1rem' }}>
        <MinimalCollapse
          header={<Trans>What is the V1 Token Payment Terminal?</Trans>}
        >
          <Trans>
            Token holders of your V1 project tokens will swap their V1 tokens
            for V2 tokens at a 1-to-1 exchange rate.
          </Trans>
        </MinimalCollapse>
      </div>
      <Button
        type="primary"
        size="small"
        onClick={onAddTerminal}
        loading={addTerminalLoading}
        disabled={completed}
      >
        <span>
          <Trans>Add terminal</Trans>
        </span>
      </Button>
    </StepSection>
  )
}
