import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { useContext, useMemo } from 'react'

export function useProjectReservedTokensArgsV3({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: BigNumber | undefined
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
