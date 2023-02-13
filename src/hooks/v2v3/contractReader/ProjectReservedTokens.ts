import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'
import useContractReader from './V2ContractReader'

export default function useProjectReservedTokens({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: BigNumber | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useContractReader<BigNumber>({
    contract: contracts.JBController,
    functionName: 'reservedTokenBalanceOf(uint256,uint256)',
    args: projectId && reservedRate ? [projectId, reservedRate] : null,
  })
}
