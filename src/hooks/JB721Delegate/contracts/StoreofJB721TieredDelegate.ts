import { Contract } from '@ethersproject/contracts'
import { useContractReadValue } from 'hooks/ContractReader'
import { useJB721TieredDelegateStore } from './JB721TieredDelegateStore'

export function useStoreOfJB721TieredDelegate({
  JB721TieredDelegate,
}: {
  JB721TieredDelegate: Contract | undefined
}) {
  // get the JBTiered721DelegateStore address on-chain
  const { value: storeAddress, loading } = useContractReadValue<string, string>(
    {
      contract: JB721TieredDelegate,
      functionName: 'store',
      args: [],
    },
  )

  const JBTiered721DelegateStore = useJB721TieredDelegateStore({
    address: storeAddress,
  })

  return { value: JBTiered721DelegateStore, loading }
}
