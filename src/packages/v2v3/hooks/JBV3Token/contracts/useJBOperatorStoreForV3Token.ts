import { Contract } from '@ethersproject/contracts'
import { useContractReadValue } from 'hooks/ContractReader'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useContext } from 'react'
import { useJBTokenStoreForV3Token } from './useJBTokenStoreForV3Token'

export function useJBOperatorStoreForV3Token(): Contract | undefined {
  const { contracts } = useContext(V2V3ContractsContext)

  const JBTokenStore = useJBTokenStoreForV3Token()

  const { value: operatorStoreAddress } = useContractReadValue<string, string>({
    contract: JBTokenStore,
    functionName: 'operatorStore',
    args: [],
  })
  const JBOperatorStore = useLoadContractFromAddress({
    address: operatorStoreAddress,
    abi: contracts?.JBOperatorStore.interface,
  })

  return JBOperatorStore
}
