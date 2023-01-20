import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useContractReadValue } from 'hooks/ContractReader'

export function useV1ProjectId() {
  const JBV3TokenContract = new Contract('', '') // TODO

  return useContractReadValue<string, BigNumber>({
    contract: JBV3TokenContract,
    functionName: 'v1ProjectId',
    args: null,
  })
}
