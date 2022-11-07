import * as constants from '@ethersproject/constants'
import { useStoreOfJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useStoreofJB721TieredDelegate'
import { JB721TierParams } from 'models/nftRewardTier'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import useV2ContractReader from './V2ContractReader'

export function useNftRewardTiersOf({
  dataSourceAddress,
  limit,
}: {
  dataSourceAddress: string | undefined
  limit?: number
}) {
  const JBTiered721DelegateStore = useStoreOfJB721TieredDelegate({
    JB721TieredDelegateAddress: dataSourceAddress,
  })

  const hasDataSource =
    dataSourceAddress && dataSourceAddress !== constants.AddressZero

  return useV2ContractReader<JB721TierParams[]>({
    contract: JBTiered721DelegateStore,
    functionName: 'tiers',
    // send null when project has no dataSource, so the fetch doesn't execute.
    args: hasDataSource
      ? [dataSourceAddress, 0, limit ?? MAX_NFT_REWARD_TIERS]
      : null,
  })
}
