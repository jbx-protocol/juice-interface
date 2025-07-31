import {
  jb721TiersHookStoreAbi,
  useJBProjectId,
  useJBRulesetContext,
  useJBUpcomingRuleset,
  useReadJb721TiersHookContractUri,
  useReadJb721TiersHookPricingContext,
  useReadJb721TiersHookStoreAddress,
  useReadJb721TiersHookStoreFlagsOf,
  useReadJb721TiersHookStoreTiersOf,
  useSuckers,
} from 'juice-sdk-react'
import React, { createContext } from 'react'
import {
  DEFAULT_NFT_FLAGS_V4,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/v2v3/editingV2Project'
import { ContractFunctionReturnType, zeroAddress } from 'viem'

import { JB721GovernanceType } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V4NftRewardsData } from 'packages/v4/models/nfts'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { useNftRewards } from './useNftRewards'

const NFT_PAGE_SIZE = 100n

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
  const { projectId, chainId } = useJBProjectId()
  const upcomingRuleset = useJBUpcomingRuleset({ projectId, chainId })
  const { data: suckers } = useSuckers()
  
  let dataHookAddress = jbRuleSet.rulesetMetadata.data?.dataHook
  
  if (jbRuleSet.ruleset.data?.cycleNumber === 0) {
    // If the ruleset is the first one, we use the upcoming ruleset's data hook address
    // (projects that haven't started yet)
    dataHookAddress = upcomingRuleset?.rulesetMetadata?.dataHook
  }

  const storeAddress = useReadJb721TiersHookStoreAddress({
    address: dataHookAddress,
    chainId
  })

  // Get all project chains, fallback to current chain if no suckers
  const projectChains = suckers?.map(s => s.peerChainId) || [chainId]

  // Fetch tiers from current chain (for metadata and structure)
  const tiersOf = useReadJb721TiersHookStoreTiersOf({
    address: storeAddress.data,
    args: [
      dataHookAddress ?? zeroAddress,
      [], // _categories
      false, // _includeResolvedUri, return in each tier a result from a tokenUriResolver if one is included in the delegate
      0n, // _startingId
      NFT_PAGE_SIZE, // limit
    ],
    chainId
  })

  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(tiersOf.data ?? [], projectChains, projectId, chainId, storeAddress.data, dataHookAddress)

  const loadedCIDs = CIDsOfNftRewardTiersResponse(tiersOf.data ?? [])

  const p = useReadJb721TiersHookPricingContext()
  const currency = Number(p.data ? p.data[0] : 0) as V2V3CurrencyOption

  const flags = useReadJb721TiersHookStoreFlagsOf({
    address: storeAddress.data,
    args: [dataHookAddress ?? zeroAddress],
    chainId
  })

  const { data: collectionMetadataUri } = useReadJb721TiersHookContractUri({
    address: dataHookAddress,
    chainId
  })

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
        uri: collectionMetadataUri,
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
