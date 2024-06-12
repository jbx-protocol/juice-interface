import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useContext, useMemo } from 'react'

export function useProjectReservedTokensArgsV3_1({
  projectId,
}: {
  projectId: number | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  const params = useMemo(() => {
    return {
      contract: contracts.JBController,
      functionName: 'reservedTokenBalanceOf(uint256)',
      args: projectId ? [projectId] : null, // JBControllerV3_1 doesn't need reservedRate
    }
  }, [contracts, projectId])

  return params
}
