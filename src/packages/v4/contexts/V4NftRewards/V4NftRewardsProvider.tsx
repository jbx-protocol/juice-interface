import {
  jb721TiersHookStoreAbi,
  useJBRulesetContext,
  useReadJb721TiersHookContractUri,
  useReadJb721TiersHookPricingContext,
  useReadJb721TiersHookStoreAddress,
  useReadJb721TiersHookStoreFlagsOf,
  useReadJb721TiersHookStoreTiersOf,
} from 'juice-sdk-react'
import React, { createContext } from 'react'
import { DEFAULT_NFT_FLAGS_V4, DEFAULT_NFT_PRICING, EMPTY_NFT_COLLECTION_METADATA } from 'redux/slices/v2v3/editingV2Project'
import { ContractFunctionReturnType, zeroAddress } from 'viem'

import { JB721GovernanceType } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V4NftRewardsData } from 'packages/v4/models/nfts'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { useNftRewards } from './useNftRewards'

// TODO: This should be imported from the SDK
export type JB721TierV4 = ContractFunctionReturnType<
  typeof jb721TiersHookStoreAbi,
  'view',
  'tiersOf'
>[0]

type NftRewardsContextType = {
  // nftRewards: is useReadJb721TiersHookStoreTiersOf.data returned
  nftRewards: V4NftRewardsData
  loading: boolean | undefined
}

export const V4NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    flags: DEFAULT_NFT_FLAGS_V4,
    governanceType: JB721GovernanceType.NONE,
    pricing: DEFAULT_NFT_PRICING,
  },
  loading: false,
})

export const V4NftRewardsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const jbRuleSet = useJBRulesetContext()
  const dataHookAddress = jbRuleSet.rulesetMetadata.data?.dataHook

  const storeAddress = useReadJb721TiersHookStoreAddress({
    address: dataHookAddress,
  })

  const tiersOf = useReadJb721TiersHookStoreTiersOf({
    address: storeAddress.data,
    args: [
      dataHookAddress ?? zeroAddress,
      [], // _categories
      false, // _includeResolvedUri, return in each tier a result from a tokenUriResolver if one is included in the delegate
      0n, // _startingId
      10n, // limit
    ],
  })

  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(tiersOf.data ?? [], 4, storeAddress.data)

  const loadedCIDs = CIDsOfNftRewardTiersResponse(tiersOf.data ?? [])

  const p = useReadJb721TiersHookPricingContext()
  const currency = Number(p.data ? p.data[0] : 0) as V2V3CurrencyOption

  const flags = useReadJb721TiersHookStoreFlagsOf({
    address: storeAddress.data,
  })

  const { data: collectionMetadataUri } =
      useReadJb721TiersHookContractUri({ address: dataHookAddress})

  const loading = React.useMemo(
    () =>
      storeAddress.isLoading ||
      tiersOf.isLoading ||
      nftRewardTiersLoading ||
      p.isLoading ||
      flags.isLoading,
    [
      storeAddress.isLoading,
      tiersOf.isLoading,
      nftRewardTiersLoading,
      p.isLoading,
      flags.isLoading,
    ],
  )

  const ctx = {
    nftRewards: {
      CIDs: loadedCIDs,
      rewardTiers: loadedRewardTiers,
      pricing: { currency },
      governanceType: JB721GovernanceType.NONE,
      collectionMetadata: {
        ...EMPTY_NFT_COLLECTION_METADATA,
        uri: collectionMetadataUri
      },
      flags: flags.data ?? DEFAULT_NFT_FLAGS_V4,
    },
    loading,
  }

  return (
    <V4NftRewardsContext.Provider value={ctx}>
      {children}
    </V4NftRewardsContext.Provider>
  )
}

export const useV4NftRewards = () => React.useContext(V4NftRewardsContext)
