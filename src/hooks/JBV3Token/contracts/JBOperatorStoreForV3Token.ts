import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContractReadValue } from 'hooks/ContractReader'
import { useContext } from 'react'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { useJBTokenStoreForV3Token } from './JBTokenStoreForV3Token'
import { Contract } from '@ethersproject/contracts'

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
