import { BigNumber } from 'ethers'
import { V1ContractName } from 'packages/v1/models/contracts'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import { V1TerminalName } from 'packages/v1/models/terminals'
import { deepEqFundingCycles } from 'packages/v1/utils/deepEqFundingCycles'
import { useCallback, useMemo } from 'react'

import useContractReader from './useContractReader'

/** Returns current funding cycle for project. */
export default function useCurrentFundingCycleOfProject(
  projectId: number | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<V1FundingCycle>({
    contract: V1ContractName.FundingCycles,
    functionName: 'currentOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: useCallback(
      (a: V1FundingCycle | undefined, b: V1FundingCycle | undefined) =>
        !deepEqFundingCycles(a, b),
      [],
    ),
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
