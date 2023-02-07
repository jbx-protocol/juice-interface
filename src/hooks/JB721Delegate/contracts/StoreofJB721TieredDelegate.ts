import { useContractReadValue } from 'hooks/ContractReader'
import { useJB721TieredDelegate } from './JB721TieredDelegate'
import { useJB721TieredDelegateStore } from './JB721TieredDelegateStore'

export function useStoreOfJB721TieredDelegate({
  JB721TieredDelegateAddress,
}: {
  JB721TieredDelegateAddress: string | undefined
}) {
  const JB721TieredDelegate = useJB721TieredDelegate({
    address: JB721TieredDelegateAddress,
  })

  // get the JBTiered721DelegateStore address on-chain
  const { value: storeAddress } = useContractReadValue<string, string>({
    contract: JB721TieredDelegate,
    functionName: 'store',
    args: [],
  })

  const JBTiered721DelegateStore = useJB721TieredDelegateStore({
    address: storeAddress,
  })

  return JBTiered721DelegateStore
}
