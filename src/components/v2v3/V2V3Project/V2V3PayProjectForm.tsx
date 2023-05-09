import { PayProjectForm } from 'components/Project/PayProjectForm'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/useValidatePrimaryEthTerminal'
import { useContext } from 'react'

export function V2V3PayProjectForm() {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const disabled = !hasCurrentFundingCycle || !isPrimaryETHTerminalValid

  return <PayProjectForm disabled={disabled} />
}
