import { V1ContractName } from 'models/v1/contracts'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import { V1TerminalName } from 'models/v1/terminals'
import { useCallback, useMemo } from 'react'
import { toHexString } from 'utils/bigNumbers'
import { deepEqFundingCycles } from 'utils/v1/deepEqFundingCycles'

import useContractReader from './useContractReader'

/** Returns current funding cycle for project. */
export default function useCurrentFundingCycleOfProject(
  projectId: number | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<V1FundingCycle>({
    contract: V1ContractName.FundingCycles,
    functionName: 'currentOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
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
                topics: [[], toHexString(BigInt(projectId))],
              },
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], toHexString(BigInt(projectId))],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], toHexString(BigInt(projectId))],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })
}
