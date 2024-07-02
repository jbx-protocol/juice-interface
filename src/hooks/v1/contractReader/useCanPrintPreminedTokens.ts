import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ContractName } from 'models/v1/contracts'
import { useContext } from 'react'
import { toHexString } from 'utils/bigNumbers'
import useContractReader from './useContractReader'

/** Returns true if premine tokens can be printed for `projectId`. */
export default function useCanPrintPreminedTokens() {
  const { projectId } = useContext(ProjectMetadataContext)

  return useContractReader<boolean>({
    contract: V1ContractName.TerminalV1,
    functionName: 'canPrintPreminedTickets',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
  })
}
