import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MinimalCollapse } from 'components/shared/MinimalCollapse'
import { useSetProjectTerminalsTx } from 'hooks/v2/transactor/SetProjectTerminalsTx'
import { useCallback, useContext, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { getAddress } from '@ethersproject/address'
import { V2ProjectContext } from 'contexts/v2/projectContext'

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

export function AddTerminalSection() {
  const [addTerminalLoading, setAddTerminalLoading] = useState<boolean>(false)
  const setProjectTerminalsTx = useSetProjectTerminalsTx()
  const { terminals } = useContext(V2ProjectContext)
  const hasMigrationTerminal = hasV1TokenPaymentTerminal(terminals)

  const onAddTerminal = useCallback(async () => {
    setAddTerminalLoading(true)
    const terminalAddress =
      JB_V1_TOKEN_PAYMENT_TERMINAL_ADDRESS[readNetwork.name]

    if (!terminalAddress) return

    const newTerminals = [...(terminals || []), terminalAddress]
    try {
      const result = await setProjectTerminalsTx({ terminals: newTerminals })
      if (!result) throw new Error('Transaction failed.')
    } catch (e) {
      emitErrorNotification('Error adding migration terminal.')
    } finally {
      setAddTerminalLoading(false)
    }
  }, [terminals, setProjectTerminalsTx])

  return (
    <StepSection
      title={<Trans>Step 1. Add V1 token payment terminal</Trans>}
      completed={hasMigrationTerminal}
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
        disabled={hasMigrationTerminal}
      >
        <span>
          <Trans>Add Terminal</Trans>
        </span>
      </Button>
    </StepSection>
  )
}
