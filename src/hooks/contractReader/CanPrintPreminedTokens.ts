import { ProjectContext } from 'contexts/projectContext'
import { BigNumber } from 'ethers'
import { ContractName } from 'models/contract-name'
import { useContext } from 'react'

import useContractReader from './ContractReader'

/** Returns true if premine tokens can be printed for `projectId`. */
export default function useCanPrintPreminedTokens() {
  const { projectId } = useContext(ProjectContext)

  return useContractReader<boolean>({
    contract: ContractName.TerminalV1,
    functionName: 'canPrintPreminedTickets',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
