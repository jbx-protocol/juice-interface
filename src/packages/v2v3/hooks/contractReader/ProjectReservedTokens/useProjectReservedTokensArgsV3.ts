import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useContext, useMemo } from 'react'

export function useProjectReservedTokensArgsV3({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: bigint | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  const params = useMemo(() => {
    return {
      contract: contracts.JBController,
      functionName: 'reservedTokenBalanceOf(uint256,uint256)',
      args: projectId && reservedRate ? [projectId, reservedRate] : null,
    }
  }, [contracts, projectId, reservedRate])

  return params
}
