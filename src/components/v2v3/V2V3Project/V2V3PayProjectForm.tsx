import { PayProjectForm } from 'components/Project/PayProjectForm'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { useContext } from 'react'
import { terminalNanaAddress } from './V2V3PayButton/V2V3ConfirmPayModal'

export function V2V3PayProjectForm() {
  const { fundingCycle, terminals } = useContext(V2V3ProjectContext)
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const disabled =
    !hasCurrentFundingCycle ||
    (!isPrimaryETHTerminalValid && !terminals?.includes(terminalNanaAddress))

  return <PayProjectForm disabled={disabled} />
}
