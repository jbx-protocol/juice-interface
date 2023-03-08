import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { JB721Tier } from 'models/nftRewardTier'
import { useContext } from 'react'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'

export function useNftTiers({
  dataSourceAddress,
  limit,
  shouldFetch,
}: {
  dataSourceAddress: string | undefined
  limit?: number
  shouldFetch?: boolean
}) {
  const {
    contracts: { JB721TieredDelegateStore },
  } = useContext(JB721DelegateContractsContext)

  // send null when project has no dataSource, so the fetch doesn't execute.
  const args = shouldFetch
    ? [dataSourceAddress, 0, limit ?? MAX_NFT_REWARD_TIERS]
    : null

  return useV2ContractReader<JB721Tier[]>({
    contract: JB721TieredDelegateStore,
    functionName: 'tiers',
    args,
  })
}
