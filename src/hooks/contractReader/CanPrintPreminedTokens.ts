import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'

import useContractReader from './ContractReader'

/** Returns true if premine tokens can be printed for `projectId`. */
export default function useCanPrintPreminedTokens(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<boolean>({
    contract: ContractName.TerminalV1,
    functionName: 'canPrintPreminedTickets',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
  })
}
