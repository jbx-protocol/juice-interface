import {
  useReadJb721TiersHookStoreAddress,
  useReadJb721TiersHookStoreTiersOf,
} from 'juice-sdk-react'
import { MAX_NFT_REWARD_TIERS } from 'packages/v2v3/constants/nftRewards'
import { Address } from 'viem'

export function useV4NftTiers({
  dataHookAddress,
  limit,
  shouldFetch,
}: {
  dataHookAddress: Address | undefined
  limit?: number
  shouldFetch?: boolean
}) {
  const { data: store } = useReadJb721TiersHookStoreAddress({
    address: dataHookAddress,
  })

  // send null when project has no dataSource, so the fetch doesn't execute.
  const args =
    shouldFetch && dataHookAddress
      ? ([
          dataHookAddress,
          [], // _categories
          false, // _includeResolvedUri, return in each tier a result from a tokenUriResolver if one is included in the delegate
          0n, // _startingId
          BigInt(limit ?? MAX_NFT_REWARD_TIERS),
        ] as const)
      : undefined

  return useReadJb721TiersHookStoreTiersOf({
    address: store,
    args,
  })
}
