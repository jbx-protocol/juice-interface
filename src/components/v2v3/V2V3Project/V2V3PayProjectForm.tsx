import { PayProjectForm } from 'components/Project/PayProjectForm'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { useContext } from 'react'

export function V2V3PayProjectForm() {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  let disabled = !hasCurrentFundingCycle || !isPrimaryETHTerminalValid
  if (projectId === 602) {
    disabled = false
  }
  // TODO: change disabled
  return <PayProjectForm disabled={disabled} />
}
