import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { BigNumber } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/useJBV3Token'

export function useV1ProjectId() {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  return useContractReadValue<string, BigNumber>({
    contract: JBV3TokenContract,
    functionName: 'v1ProjectId',
    args: [],
  })
}
