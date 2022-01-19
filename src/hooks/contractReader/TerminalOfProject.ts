import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'

import useContractReader from './ContractReader'

/** Returns address of terminal contract used by project. */
export default function useTerminalOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: ContractName.TerminalDirectory,
    functionName: 'terminalOf',
    args:
      projectId !== undefined
        ? [BigNumber.from(projectId).toHexString()]
        : null,
  })
}
