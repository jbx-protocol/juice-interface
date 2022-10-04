import { BigNumber } from '@ethersproject/bignumber'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1ContractName } from 'models/v1/contracts'
import { useContext } from 'react'
import useContractReader from './ContractReader'

/** Returns true if premine tokens can be printed for `projectId`. */
export default function useCanPrintPreminedTokens() {
  const { projectId } = useContext(ProjectMetadataContext)

  return useContractReader<boolean>({
    contract: V1ContractName.TerminalV1,
    functionName: 'canPrintPreminedTickets',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
