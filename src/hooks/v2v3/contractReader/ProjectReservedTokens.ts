import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
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
    functionName: 'reservedTokenBalanceOf',
    args: projectId && reservedRate ? [projectId, reservedRate] : null,
  })
}
