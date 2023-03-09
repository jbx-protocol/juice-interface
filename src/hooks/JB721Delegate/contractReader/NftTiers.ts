import {
  JB721_DELEGATE_V1,
  JB721_DELEGATE_V1_1,
} from 'constants/delegateVersions'
import { DEFAULT_JB_721_TIER_CATEGORY } from 'constants/transactionDefaults'
import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { JB721DelegateVersion, JB721Tier } from 'models/nftRewards'
import { useContext } from 'react'
import { MAX_NFT_REWARD_TIERS } from 'utils/nftRewards'
import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'

function buildArgs(
  version: JB721DelegateVersion,
  {
    dataSourceAddress,
    limit,
  }: { dataSourceAddress: string | undefined; limit?: number },
) {
  switch (version) {
    case JB721_DELEGATE_V1:
      return [
        dataSourceAddress,
        0, // _startingId
        limit ?? MAX_NFT_REWARD_TIERS,
      ]
    case JB721_DELEGATE_V1_1:
      return [
        dataSourceAddress,
        DEFAULT_JB_721_TIER_CATEGORY, // _category
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

  return useV2ContractReader<JB721Tier[]>({
    contract: JB721TieredDelegateStore,
    functionName: 'tiers',
    args,
  })
}
