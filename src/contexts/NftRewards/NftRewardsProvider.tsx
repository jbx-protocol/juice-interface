import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import useNftRewards from 'contexts/NftRewards/useNftRewards'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useNftCollectionMetadataUri } from 'hooks/JB721Delegate/contractReader/useNftCollectionMetadataUri'
import { useNftCollectionPricingContext } from 'hooks/JB721Delegate/contractReader/useNftCollectionPricingContext'
import { useNftFlagsOf } from 'hooks/JB721Delegate/contractReader/useNftFlagsOf'
import { useNftTiers } from 'hooks/JB721Delegate/contractReader/useNftTiers'
import { JB721GovernanceType, NftRewardTier } from 'models/nftRewards'
import { useContext, useMemo } from 'react'
import {
  DEFAULT_NFT_FLAGS,
  DEFAULT_NFT_PRICING,
  EMPTY_NFT_COLLECTION_METADATA,
} from 'redux/slices/editingV2Project'
import { CIDsOfNftRewardTiersResponse } from 'utils/nftRewards'
import { JB721DelegateContractsContext } from './JB721DelegateContracts/JB721DelegateContractsContext'

const RS_PROJECT_ID = 618

const RS_CIDS = [
  'Qmas76JPESr1j61UNH62KUipLefCZF2T9Dvb4ti8yZ83RY',
  'QmbSfHJd73MWb7H9VjkJVevda35bXejeK8erxgfMyLeqd6',
  'QmXgc9R5EFLf5endrJq9BJn4BC1RnCnZwf5j4dd37pwKxi',
  'QmP7pjSr3jRFQnxX7CfNVT5Mh4QbTnATUrhm9CZxXVj3kL',
  'QmStAWhXeME5QDgW4HdVr2jzjg6AY1qod1qorjq1tSybyg',
]

const RS_TIERS: NftRewardTier[] = [
  {
    id: 7,
    name: 'The Future of Freedom',
    description:
      'Hand-drawn NFT based on Brennen.eth’s vote with reason on NounsDAO prop 493.',
    contributionFloor: 0.15,
    maxSupply: 200,
    remainingSupply: 200,
    fileUrl:
      'https://jbm.infura-ipfs.io/ipfs/QmcGY2ZXYVY8YCMXmQW8fesi9YadHFB7fCeey67DAmer2j',
    beneficiary: '0x0000000000000000000000000000000000000000',
    reservedRate: 0,
    votingWeight: '0',
    externalLink: undefined,
  },
  {
    id: 8,
    name: 'Stand Against Overregulation',
    description:
      'Hand-drawn NFT based on Brennen.eth’s vote with reason on NounsDAO prop 493.',
    contributionFloor: 0.5,
    maxSupply: 100,
    remainingSupply: 100,
    fileUrl:
      'https://jbm.infura-ipfs.io/ipfs/QmRTEYfcpqCNRx7JY838qusNKWZcuwz3iTajTiory3bfno',
    beneficiary: '0x0000000000000000000000000000000000000000',
    reservedRate: 0,
    votingWeight: '0',
    externalLink: undefined,
  },
  {
    id: 9,
    name: 'Economic Rights',
    description:
      'Hand-drawn NFT based on Brennen.eth’s vote with reason on NounsDAO prop 493.',
    contributionFloor: 1,
    maxSupply: 50,
    remainingSupply: 50,
    fileUrl:
      'https://jbm.infura-ipfs.io/ipfs/Qmcjk17kQX3nP3FsjjymY9UZcC6yB6gXCMUdsyPJiw37e9',
    beneficiary: '0x0000000000000000000000000000000000000000',
    reservedRate: 0,
    votingWeight: '0',
    externalLink: undefined,
  },
  {
    id: 10,
    name: 'Free Enterprise',
    description:
      'Hand-drawn NFT based on Brennen.eth’s vote with reason on NounsDAO prop 493.',
    contributionFloor: 5,
    maxSupply: 20,
    remainingSupply: 20,
    fileUrl:
      'https://jbm.infura-ipfs.io/ipfs/QmaYMLbAMZnbi9R4TmVGaZ6JbAWyzuorxCRhuEQEpEnVZa',
    beneficiary: '0x0000000000000000000000000000000000000000',
    reservedRate: 0,
    votingWeight: '0',
    externalLink: undefined,
  },
  {
    id: 11,
    name: 'Viva Resistance!',
    description:
      'Hand-drawn NFT based on Brennen.eth’s vote with reason on NounsDAO prop 493.',
    contributionFloor: 10,
    maxSupply: 6,
    remainingSupply: 6,
    fileUrl:
      'https://jbm.infura-ipfs.io/ipfs/QmfS34QcGKSw79AHB8nLtZt49VZh34uBBNMNyRjhFYtECu',
    beneficiary: '0x0000000000000000000000000000000000000000',
    reservedRate: 0,
    votingWeight: '0',
    externalLink: undefined,
  },
]

export const NftRewardsProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { fundingCycleMetadata } = useContext(V2V3ProjectContext)
  const { projectMetadata, projectId } = useContext(ProjectMetadataContext)
  const { version: JB721DelegateVersion } = useContext(
    JB721DelegateContractsContext,
  )

  const dataSourceAddress = fundingCycleMetadata?.dataSource

  // don't fetch stuff if there's no datasource in the first place.
  const hasNftRewards = Boolean(JB721DelegateVersion)

  // fetch NFT tier data from the contract
  const { data: nftRewardTiersResponse, loading: nftRewardsCIDsLoading } =
    useNftTiers({
      dataSourceAddress,
      shouldFetch: hasNftRewards,
    })

  // catchall to ensure nfts are never loaded if hasNftRewards is false (there's no datasource).
  const tierData = hasNftRewards ? nftRewardTiersResponse ?? [] : []
  const loadedCIDs = CIDsOfNftRewardTiersResponse(tierData)

  const { data: pricing } = useNftCollectionPricingContext()

  // fetch NFT metadata (its image, name etc.) from ipfs
  const { data: loadedRewardTiers, isLoading: nftRewardTiersLoading } =
    useNftRewards(tierData, projectId, dataSourceAddress)

  // Roman storm specific stuff, cached data

  const rewardTiers = useMemo(() => {
    if (projectId !== RS_PROJECT_ID) return loadedRewardTiers

    if (!loadedRewardTiers?.length) return RS_TIERS
    return loadedRewardTiers
  }, [projectId, loadedRewardTiers])

  const CIDs = useMemo(() => {
    if (projectId !== RS_PROJECT_ID) return loadedCIDs

    if (!loadedCIDs?.length) return RS_CIDS
    return loadedCIDs
  }, [projectId, loadedCIDs])

  const nftsLoading = useMemo(() => {
    if (projectId !== RS_PROJECT_ID)
      return Boolean(nftRewardTiersLoading || nftRewardsCIDsLoading)
    return false // Roman storm is cached so we don't need to load anything
  }, [nftRewardTiersLoading, nftRewardsCIDsLoading, projectId])

  // fetch some other related stuff
  const { data: collectionMetadataUri } =
    useNftCollectionMetadataUri(dataSourceAddress)
  const { data: flags } = useNftFlagsOf(dataSourceAddress)

  const contextData = {
    nftRewards: {
      rewardTiers,
      pricing: pricing ?? DEFAULT_NFT_PRICING,
      // TODO: Load governance type
      governanceType: JB721GovernanceType.NONE,
      CIDs,
      collectionMetadata: {
        ...EMPTY_NFT_COLLECTION_METADATA, // only load the metadata CID in the context - other data not necessary
        uri: collectionMetadataUri,
      },
      postPayModal: projectMetadata?.nftPaymentSuccessModal,
      flags: flags ?? DEFAULT_NFT_FLAGS,
    },
    loading: nftsLoading,
  }

  return (
    <NftRewardsContext.Provider value={contextData}>
      {children}
    </NftRewardsContext.Provider>
  )
}
