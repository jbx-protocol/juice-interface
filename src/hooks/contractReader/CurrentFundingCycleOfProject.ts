import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { FundingCycle } from 'models/funding-cycle'
import { TerminalName } from 'models/terminal-name'
import { useCallback, useMemo } from 'react'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'

import useContractReader from './ContractReader'

/** Returns current funding cycle for project. */
export default function useCurrentFundingCycleOfProject(
  projectId: BigNumberish | undefined,
  terminalName: TerminalName | undefined,
) {
  return useContractReader<FundingCycle>({
    contract: JuiceboxV1ContractName.FundingCycles,
    functionName: 'currentOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: useCallback((a, b) => !deepEqFundingCycles(a, b), []),
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: JuiceboxV1ContractName.FundingCycles,
                eventName: 'Configure',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })
}
