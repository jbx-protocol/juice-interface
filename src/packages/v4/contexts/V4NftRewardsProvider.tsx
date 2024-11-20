import { useJBContractContext, useJBRulesetMetadata } from 'juice-sdk-react'
import { JB721GovernanceType, NftRewardTier } from 'models/nftRewards'
import { NftRewardsContext } from 'packages/v2v3/contexts/NftRewards/NftRewardsContext'
import { useNftCollectionPricingContext } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftCollectionPricingContext'
import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_NFT_FLAGS,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { useV4NftTiers } from './useV4NftTiers'

export const V4NftRewardsProvider: React.FC<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { data } = useJBRulesetMetadata()
  const { projectId } = useJBContractContext()

  const [firstLoad, setFirstLoad] = useState(true)

  const dataHookAddress = data?.dataHook

  // don't fetch stuff if there's no datasource in the first place.
  const hasNftRewards = Boolean(dataHookAddress)

  // fetch NFT tier data from the contract
  const { data: nftRewardTiersResponse, isLoading: nftRewardsCIDsLoading } =
    useV4NftTiers({
      dataHookAddress,
      shouldFetch: hasNftRewards,
    })

  // catchall to ensure nfts are never loaded if hasNftRewards is false (there's no datasource).
  const tierData = hasNftRewards ? nftRewardTiersResponse ?? [] : []
  const loadedCIDs = CIDsOfNftRewardTiersResponse(
    tierData.map(t => ({ encodedIPFSUri: t.encodedIPFSUri })),
  )

  const { data: pricing } = useNftCollectionPricingContext()

  // // fetch NFT metadata (its image, name etc.) from ipfs
  // const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
  //   useNftRewards(tierData, projectId, dataHookAddress)
  const nftRewardTiersLoading = false // todo wip
  // TODO very wip - townhall demo
  const rewardTiers: NftRewardTier[] = tierData.map(t => {
    return {
      contributionFloor: Number(t.price), // ETH or USD amount
      fileUrl: '',
      name: 'demo - WIP',
      id: t.id,
      maxSupply: undefined,
      remainingSupply: undefined,
      reservedRate: undefined,
      beneficiary: undefined,
      votingWeight: undefined,
      externalLink: undefined,
      description: undefined,
    }
  })
  const CIDs = loadedCIDs

  useEffect(() => {
    // First load is always true until either nftRewardTiersLoading or nftRewardsCIDsLoading is true
    if (firstLoad && (nftRewardTiersLoading || nftRewardsCIDsLoading)) {
      setFirstLoad(false)
    }
  }, [firstLoad, nftRewardTiersLoading, nftRewardsCIDsLoading])

  const nftsLoading = useMemo(() => {
    return Boolean(firstLoad || nftRewardTiersLoading || nftRewardsCIDsLoading)
  }, [firstLoad, nftRewardTiersLoading, nftRewardsCIDsLoading])

  // fetch some other related stuff
  // const { data: collectionMetadataUri } =
  //   useNftCollectionMetadataUri(dataSourceAddress)
  // const { data: flags } = useNftFlagsOf(dataSourceAddress)

  const contextData = {
    nftRewards: {
      rewardTiers,
      pricing: pricing ?? DEFAULT_NFT_PRICING,
      // TODO: Load governance type
      governanceType: JB721GovernanceType.NONE,
      CIDs,
      // TODO wip
      collectionMetadata: {
        ...EMPTY_NFT_COLLECTION_METADATA, // only load the metadata CID in the context - other data not necessary
        // uri: collectionMetadataUri,
        uri: '', // TODO
      },
      postPayModal: undefined,
      // postPayModal: projectMetadata?.nftPaymentSuccessModal,
      // flags: flags ?? DEFAULT_NFT_FLAGS, TODO wip
      flags: DEFAULT_NFT_FLAGS
    },
    loading: nftsLoading,
  }

  return (
    <NftRewardsContext.Provider value={contextData}>
      {children}
    </NftRewardsContext.Provider>
  )
}
