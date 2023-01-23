import { useStoreOfJB721TieredDelegate } from 'hooks/JB721Delegate/contracts/useStoreofJB721TieredDelegate'
import { JB721TierParams } from 'models/nftRewardTier'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'

export function useNftRewardTiersOf({
  dataSourceAddress,
  limit,
  shouldFetch,
}: {
  dataSourceAddress: string | undefined
  limit?: number
  shouldFetch?: boolean
}) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })

  // send null when project has no dataSource, so the fetch doesn't execute.
  const args = shouldFetch
    ? [dataSourceAddress, 0, limit ?? MAX_NFT_REWARD_TIERS]
    : null

  return useV2ContractReader<JB721TierParams[]>({
    contract: JBTiered721DelegateStore,
    functionName: 'tiers',
    args,
  })
}
