import { Contract } from 'ethers'
import { useContractReadValue } from 'hooks/ContractReader'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { useJB721TieredDelegateStore } from './useJB721TieredDelegateStore'

export function useStoreOfJB721TieredDelegate({
  JB721TieredDelegate,
  version,
}: {
  JB721TieredDelegate: Contract | undefined
  version: JB721DelegateVersion | undefined
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
    version,
  })

  return { value: JBTiered721DelegateStore, loading }
}
