import {
  jb721TiersHookStoreAbi,
  useJBRulesetContext,
  useReadJb721TiersHookPricingContext,
  useReadJb721TiersHookStoreAddress,
  useReadJb721TiersHookStoreFlagsOf,
  useReadJb721TiersHookStoreTiersOf,
} from 'juice-sdk-react'
import { JB721GovernanceType } from 'models/nftRewards'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import React, { createContext } from 'react'
import { DEFAULT_NFT_PRICING } from 'redux/slices/v2v3/editingV2Project'
import { NftRewardsData } from 'redux/slices/v2v3/shared/v2ProjectTypes'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { ContractFunctionReturnType } from 'viem'
import { useNftRewards } from './useNftRewards'

const DEFAULT_NFT_FLAGS = {
  noNewTiersWithReserves: false,
  noNewTiersWithVotes: false,
  noNewTiersWithOwnerMinting: false,
  preventOverspending: false,
}

// TODO: This should be imported from the SDK
export type JB721TierV4 = ContractFunctionReturnType<
  typeof jb721TiersHookStoreAbi,
  'view',
  'tiersOf'
>[0]

type NftRewardsContextType = {
  // nftRewards: is useReadJb721TiersHookStoreTiersOf.data returned
  nftRewards: Omit<
    NftRewardsData,
    'flags' | 'collectionMetadata' | 'postPayModal'
  >
  loading: boolean | undefined
}

export const V4NftRewardsContext = createContext<NftRewardsContextType>({
  nftRewards: {
    CIDs: undefined,
    rewardTiers: undefined,
    // postPayModal: undefined,
    // collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    // flags: DEFAULT_NFT_FLAGS,
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
      dataHookAddress ?? `0x${'0'.repeat(40)}`,
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
    address: '0x7b1F4Ba6312A104E645B06Ab97e4CaA1ef0F773f',
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
      // collectionMetadata: {
      //   ...EMPTY_NFT_COLLECTION_METADATA,
      //   uri: collection
      // }
      // postPayModal: projectMetadata?.nftPaymentSuccessModal,
      // flags: flags.data ?? DEFAULT_NFT_FLAGS,
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
