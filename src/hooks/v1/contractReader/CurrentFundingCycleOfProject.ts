import { BigNumber, BigNumberish } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { FundingCycle } from 'models/funding-cycle'
import { V1TerminalName } from 'models/v1/terminals'
import { useCallback, useMemo } from 'react'
import { deepEqFundingCycles } from 'utils/deepEqFundingCycles'

import useContractReader from './ContractReader'

/** Returns current funding cycle for project. */
export default function useCurrentFundingCycleOfProject(
  projectId: BigNumberish | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<FundingCycle>({
    contract: V1ContractName.FundingCycles,
    functionName: 'currentOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: useCallback((a, b) => !deepEqFundingCycles(a, b), []),
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: V1ContractName.FundingCycles,
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
