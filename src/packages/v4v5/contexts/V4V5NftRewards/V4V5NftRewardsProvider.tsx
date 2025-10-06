/* eslint-disable no-console */
import {
  useJBProjectId,
  useJBRulesetContext,
  useJBUpcomingRuleset,
  useSuckers,
} from 'juice-sdk-react'
import { jb721TiersHookStoreAbi, jb721TiersHookAbi } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'
import React, { createContext } from 'react'
import {
  DEFAULT_NFT_FLAGS_V4,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/v2v3/editingV2Project'
import { ContractFunctionReturnType, zeroAddress } from 'viem'

import { JB721GovernanceType } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V4V5NftRewardsData } from 'packages/v4v5/models/nfts'
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
  nftRewards: V4V5NftRewardsData
  loading: boolean | undefined
}

export const V4V5NftRewardsContext = createContext<NftRewardsContextType>({
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

export const V4V5NftRewardsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const jbRuleSet = useJBRulesetContext()
  const { projectId, chainId } = useJBProjectId()
  const upcomingRuleset = useJBUpcomingRuleset({ projectId, chainId })
  const { data: suckers } = useSuckers()

  let dataHookAddress = jbRuleSet.rulesetMetadata.data?.dataHook
  console.log('[V4V5NftRewards] Initial dataHook address from rulesetMetadata:', dataHookAddress)

  if (jbRuleSet.ruleset.data?.cycleNumber === 0) {
    // If the ruleset is the first one, we use the upcoming ruleset's data hook address
    // (projects that haven't started yet)
    dataHookAddress = upcomingRuleset?.rulesetMetadata?.dataHook
    console.log('[V4V5NftRewards] Using upcoming ruleset dataHook (cycle #0):', dataHookAddress)
  }

  const storeAddress = useReadContract({
    abi: jb721TiersHookAbi,
    address: dataHookAddress,
    functionName: 'STORE',
    chainId,
  })
  console.log('[V4V5NftRewards] STORE address result:', {
    data: storeAddress.data,
    isLoading: storeAddress.isLoading,
    error: storeAddress.error,
  })

  // Get all project chains, fallback to current chain if no suckers
  const projectChains = suckers?.map(s => s.peerChainId).filter(id => id !== undefined) || (chainId ? [chainId] : [])
  console.log('[V4V5NftRewards] Project chains for NFT fetching:', projectChains)

  // Fetch tiers from current chain (for metadata and structure)
  const tiersOf = useReadContract({
    abi: jb721TiersHookStoreAbi,
    address: storeAddress.data,
    functionName: 'tiersOf',
    args: [
      dataHookAddress ?? zeroAddress,
      [], // _categories
      false, // _includeResolvedUri, return in each tier a result from a tokenUriResolver if one is included in the delegate
      0n, // _startingId
      NFT_PAGE_SIZE, // limit
    ],
    chainId,
  })
  console.log('[V4V5NftRewards] tiersOf result:', {
    tierCount: tiersOf.data?.length ?? 0,
    isLoading: tiersOf.isLoading,
    error: tiersOf.error,
    firstTier: tiersOf.data?.[0],
  })

  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(
      tiersOf.data ?? [],
      projectChains,
      projectId,
      chainId,
      storeAddress.data as `0x${string}` | undefined,
      dataHookAddress as `0x${string}` | undefined,
    )
  console.log('[V4V5NftRewards] Loaded reward tiers after useNftRewards:', {
    tierCount: loadedRewardTiers?.length ?? 0,
    isLoading: nftRewardTiersLoading,
    firstTier: loadedRewardTiers?.[0],
  })

  const loadedCIDs = CIDsOfNftRewardTiersResponse(tiersOf.data ?? [])

  const p = useReadContract({
    abi: jb721TiersHookAbi,
    address: dataHookAddress,
    functionName: 'pricingContext',
    chainId,
  })
  const currency = Number(p.data ? p.data[0] : 0) as V2V3CurrencyOption

  const flags = useReadContract({
    abi: jb721TiersHookStoreAbi,
    address: storeAddress.data,
    functionName: 'flagsOf',
    args: [dataHookAddress ?? zeroAddress],
    chainId,
  })

  const { data: collectionMetadataUri } = useReadContract({
    abi: jb721TiersHookAbi,
    address: dataHookAddress,
    functionName: 'contractURI',
    chainId,
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
  console.log('[V4V5NftRewards] Final context data being provided:', {
    rewardTiersCount: ctx.nftRewards.rewardTiers?.length ?? 0,
    loading: ctx.loading,
    hasCIDs: (ctx.nftRewards.CIDs?.length ?? 0) > 0,
    hasFlags: !!ctx.nftRewards.flags,
  })

  return (
    <V4V5NftRewardsContext.Provider value={ctx}>
      {children}
    </V4V5NftRewardsContext.Provider>
  )
}

export const useV4V5NftRewards = () => React.useContext(V4V5NftRewardsContext)
