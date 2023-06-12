import {
  JB721_DELEGATE_V3,
  JB721_DELEGATE_V3_1,
  JB721_DELEGATE_V3_2,
  JB721_DELEGATE_V3_3,
} from 'constants/delegateVersions'
import { MAX_NFT_REWARD_TIERS } from 'constants/nftRewards'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import {
  JB721DelegateVersion,
  JB721TierV3,
  JB_721_TIER_V3_2,
} from 'models/nftRewards'
import { useContext } from 'react'
import useV2ContractReader from '../../v2v3/contractReader/useV2ContractReader'

function buildArgs(
  version: JB721DelegateVersion,
  {
    dataSourceAddress,
    limit,
  }: { dataSourceAddress: string | undefined; limit?: number },
) {
  switch (version) {
    case JB721_DELEGATE_V3:
      return [
        dataSourceAddress,
        0, // _startingId
        limit ?? MAX_NFT_REWARD_TIERS,
      ]
    case JB721_DELEGATE_V3_1:
      return [
        dataSourceAddress,
        0, // _category
        0, // _startingId
        limit ?? MAX_NFT_REWARD_TIERS,
      ]
    case JB721_DELEGATE_V3_2:
      return [
        dataSourceAddress,
        [], // _categories
        false, // _includeResolvedUri, return in each tier a result from a tokenUriResolver if one is included in the delegate
        0, // _startingId
        limit ?? MAX_NFT_REWARD_TIERS,
      ]

    case JB721_DELEGATE_V3_3:
      return [
        dataSourceAddress,
        [], // _categories
        false, // _includeResolvedUri, return in each tier a result from a tokenUriResolver if one is included in the delegate
        0, // _startingId
        limit ?? MAX_NFT_REWARD_TIERS,
      ]
    default:
      return null
  }
}

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
    version,
  } = useContext(JB721DelegateContractsContext)

  // send null when project has no dataSource, so the fetch doesn't execute.
  const args =
    shouldFetch && version
      ? buildArgs(version, { dataSourceAddress, limit })
      : null

  return useV2ContractReader<JB721TierV3[] | JB_721_TIER_V3_2[]>({
    contract: JB721TieredDelegateStore,
    functionName:
      version === JB721_DELEGATE_V3_2 || version === JB721_DELEGATE_V3_3
        ? 'tiersOf'
        : 'tiers',
    args,
  })
}
