import {
  JB721DELAGATE_V3_1_PAY_METADATA,
  JB721DELAGATE_V3_PAY_METADATA,
} from 'components/Project/PayProjectForm/hooks/usePayProjectForm'
import { NftFileType } from 'components/inputs/UploadNoStyle'
import {
  JB721_DELEGATE_V3,
  JB721_DELEGATE_V3_1,
  JB721_DELEGATE_V3_2,
} from 'constants/delegateVersions'
import { VIDEO_FILE_TYPES } from 'constants/fileTypes'
import { juiceboxEmojiImageUri } from 'constants/images'
import { WAD_DECIMALS } from 'constants/numbers'
import {
  DEFAULT_ALLOW_OVERSPENDING,
  DEFAULT_JB_721_TIER_CATEGORY,
} from 'constants/transactionDefaults'
import { DEFAULT_NFT_MAX_SUPPLY } from 'contexts/NftRewards/NftRewards'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { defaultAbiCoder, parseEther } from 'ethers/lib/utils'
import { pinJson } from 'lib/api/ipfs'
import round from 'lodash/round'
import {
  IPFSNftCollectionMetadata,
  IPFSNftRewardTier,
  JB721DelegateVersion,
  JB721GovernanceType,
  JB721PricingParams,
  JB721TierParams,
  JB721TierV3,
  JBDeployTiered721DelegateData,
  JBTiered721Flags,
  JB_721_TIER_PARAMS_V3_1,
  JB_721_TIER_PARAMS_V3_2,
  JB_721_TIER_V3_2,
  JB_DEPLOY_TIERED_721_DELEGATE_DATA_V3_1,
  NftRewardTier,
} from 'models/nftRewards'
import { decodeEncodedIpfsUri, encodeIpfsUri, ipfsUri } from 'utils/ipfs'
import { V2V3_CURRENCY_ETH } from './v2v3/currency'

export const MAX_NFT_REWARD_TIERS = 69
const IJB721Delegate_INTERFACE_ID = '0xb3bcbb79'

export function sortNftsByContributionFloor(
  rewardTiers: NftRewardTier[],
): NftRewardTier[] {
  return rewardTiers
    .slice()
    .sort((a, b) => a.contributionFloor - b.contributionFloor)
}

// Returns the highest NFT reward tier that a payer is eligible given their pay amount
export function getHighestAffordableNft({
  payAmountETH,
  nftRewardTiers,
}: {
  payAmountETH: number
  nftRewardTiers: NftRewardTier[]
}) {
  let nftReward: NftRewardTier | null = null
  // all nft's who's thresholds are below the pay amount
  const eligibleNftRewards = nftRewardTiers.filter(rewardTier => {
    return rewardTier.contributionFloor <= payAmountETH
  })
  if (eligibleNftRewards.length) {
    // take the maximum which is the only one received by payer
    nftReward = eligibleNftRewards.reduce((prev, curr) => {
      return prev.contributionFloor > curr.contributionFloor ? prev : curr
    })
  }
  return nftReward
}

export function getNftRewardOfFloor({
  floor,
  rewardTiers,
}: {
  floor: number
  rewardTiers: NftRewardTier[]
}) {
  return rewardTiers.find(tier => tier.contributionFloor === floor)
}

// returns an array of CIDs from a given array of RewardTier obj's
export function CIDsOfNftRewardTiersResponse(
  nftRewardTiersResponse: JB721TierV3[] | JB_721_TIER_V3_2[] | undefined,
): string[] {
  const cids =
    nftRewardTiersResponse
      ?.map(contractRewardTier => {
        return decodeEncodedIpfsUri(contractRewardTier.encodedIPFSUri)
      })
      .filter(cid => cid.length > 0) ?? []

  return cids
}

// Default name for NFT collections on NFT marketplaces
export const defaultNftCollectionName = (projectName: string | undefined) =>
  `${projectName?.length ? projectName : "Your project's"} NFT rewards`

// Default description for NFT collections on NFT marketplaces
export const defaultNftCollectionDescription = (
  projectName: string | undefined,
) =>
  `NFTs rewarded to ${
    projectName?.length ? projectName : 'your project'
  }'s Juicebox contributors.`

async function uploadNftRewardToIPFS({
  rewardTier,
  rank,
}: {
  rewardTier: NftRewardTier
  rank: number
}): Promise<string> {
  const ipfsNftRewardTier: IPFSNftRewardTier = {
    description: rewardTier.description,
    name: rewardTier.name,
    externalLink: rewardTier.externalLink,
    symbol: undefined,
    image: rewardTier.fileUrl,
    imageDataUrl: undefined,
    artifactUri: undefined,
    animationUri: undefined,
    displayUri: undefined,
    youtubeUri: undefined,
    backgroundColor: undefined,
    attributes: [
      {
        trait_type: 'Min. Contribution',
        value: rewardTier.contributionFloor,
      },
      {
        trait_type: 'Max. Supply',
        value: rewardTier.maxSupply,
      },
      {
        trait_type: 'tier',
        value: rank,
      },
    ],
  }

  const res = await pinJson(ipfsNftRewardTier)

  return res.Hash
}

/**
 * Uploads each nft reward tier to an individual location on IPFS
 * @returns array of CIDs which point to each rewardTier on IPFS
 */
export async function pinNftRewards(
  nftRewards: NftRewardTier[],
): Promise<string[]> {
  return await Promise.all(
    // NOTE: Other code relies on the fact that the reward tiers are sorted by contribution floor
    // DO NOT CHANGE without considering all implications.
    // TODO: fix this ^
    sortNftsByContributionFloor(nftRewards).map((rewardTier, idx) =>
      uploadNftRewardToIPFS({
        rewardTier,
        rank: idx + 1, // relies on rewardTiers being sorted by contributionFloor
      }),
    ),
  )
}

export async function pinNftCollectionMetadata({
  collectionName,
  collectionDescription,
  collectionLogoUri,
  collectionInfoUri,
}: {
  collectionName: string
  collectionDescription: string
  collectionLogoUri: string | undefined
  collectionInfoUri: string | undefined
}) {
  const IPFSNftCollectionMetadata: IPFSNftCollectionMetadata = {
    name: collectionName,
    description: collectionDescription,
    image: collectionLogoUri?.length
      ? collectionLogoUri
      : juiceboxEmojiImageUri,
    seller_fee_basis_points: undefined,
    external_link: collectionInfoUri?.length
      ? collectionInfoUri
      : 'https://juicebox.money',
    fee_recipient: undefined,
  }

  const res = await pinJson(IPFSNftCollectionMetadata)
  return res.Hash
}

// Determines if two NFT reward tiers are equal
export function tiersEqual({
  tier1,
  tier2,
}: {
  tier1: NftRewardTier
  tier2: NftRewardTier
}) {
  return (
    tier1.contributionFloor === tier2.contributionFloor &&
    tier1.description === tier2.description &&
    tier1.externalLink === tier2.externalLink &&
    tier1.fileUrl === tier2.fileUrl &&
    tier1.maxSupply === tier2.maxSupply &&
    tier1.name === tier2.name &&
    tier1.votingWeight === tier2.votingWeight
  )
}

function nftRewardTierToJB721TierParamsV3(
  rewardTier: NftRewardTier,
  cid: string,
): JB721TierParams {
  const contributionFloorWei = parseEther(
    rewardTier.contributionFloor.toString(),
  )
  const maxSupply = rewardTier.maxSupply
  const initialQuantity = BigNumber.from(maxSupply ?? DEFAULT_NFT_MAX_SUPPLY)
  const encodedIPFSUri = encodeIpfsUri(cid)

  const reservedRate = rewardTier.reservedRate
    ? BigNumber.from(rewardTier.reservedRate - 1)
    : BigNumber.from(0)
  const reservedTokenBeneficiary =
    rewardTier.beneficiary ?? constants.AddressZero
  const votingUnits = rewardTier.votingWeight
    ? BigNumber.from(rewardTier.votingWeight)
    : BigNumber.from(0)

  return {
    contributionFloor: contributionFloorWei,
    lockedUntil: BigNumber.from(0),
    initialQuantity,
    votingUnits,
    reservedRate,
    reservedTokenBeneficiary,
    encodedIPFSUri,
    allowManualMint: false,
    transfersPausable: false,
    shouldUseBeneficiaryAsDefault: false,
  }
}

function nftRewardTierToJB721TierParamsV3_1(
  rewardTier: NftRewardTier,
  cid: string,
): JB_721_TIER_PARAMS_V3_1 {
  const contributionFloorWei = parseEther(
    rewardTier.contributionFloor.toString(),
  )
  const maxSupply = rewardTier.maxSupply
  const initialQuantity = BigNumber.from(maxSupply ?? DEFAULT_NFT_MAX_SUPPLY)
  const encodedIPFSUri = encodeIpfsUri(cid)

  const reservedRate = rewardTier.reservedRate
    ? BigNumber.from(rewardTier.reservedRate - 1)
    : BigNumber.from(0)
  const reservedTokenBeneficiary =
    rewardTier.beneficiary ?? constants.AddressZero
  const votingUnits = rewardTier.votingWeight
    ? BigNumber.from(rewardTier.votingWeight)
    : BigNumber.from(0)

  return {
    contributionFloor: contributionFloorWei,
    lockedUntil: BigNumber.from(0),
    initialQuantity,
    votingUnits,
    reservedRate,
    reservedTokenBeneficiary,
    encodedIPFSUri,
    allowManualMint: false,
    transfersPausable: false,
    royaltyRate: 0,
    royaltyBeneficiary: constants.AddressZero, // address
    shouldUseReservedTokenBeneficiaryAsDefault: false,
    shouldUseRoyaltyBeneficiaryAsDefault: false,
    category: DEFAULT_JB_721_TIER_CATEGORY,
  }
}

function nftRewardTierToJB721TierParamsV3_2(
  rewardTier: NftRewardTier,
  cid: string,
): JB_721_TIER_PARAMS_V3_2 {
  const price = parseEther(rewardTier.contributionFloor.toString())
  const maxSupply = rewardTier.maxSupply
  const initialQuantity = BigNumber.from(maxSupply ?? DEFAULT_NFT_MAX_SUPPLY)
  const encodedIPFSUri = encodeIpfsUri(cid)

  const reservedRate = rewardTier.reservedRate
    ? BigNumber.from(rewardTier.reservedRate - 1)
    : BigNumber.from(0)
  const reservedTokenBeneficiary =
    rewardTier.beneficiary ?? constants.AddressZero
  const votingUnits = rewardTier.votingWeight
    ? BigNumber.from(rewardTier.votingWeight)
    : BigNumber.from(0)

  return {
    price,
    initialQuantity,
    votingUnits,
    reservedRate,
    reservedTokenBeneficiary,
    encodedIPFSUri,
    allowManualMint: false,
    transfersPausable: false,
    shouldUseReservedTokenBeneficiaryAsDefault: false,
    category: DEFAULT_JB_721_TIER_CATEGORY,
    useVotingUnits: false,
  }
}

export function buildJB721TierParams({
  cids, // MUST BE SORTED BY CONTRIBUTION FLOOR (TODO: not ideal)
  rewardTiers,
  version,
}: {
  cids: string[]
  rewardTiers: NftRewardTier[]
  version: JB721DelegateVersion
}): (JB721TierParams | JB_721_TIER_PARAMS_V3_1 | JB_721_TIER_PARAMS_V3_2)[] {
  const sortedRewardTiers = sortNftsByContributionFloor(rewardTiers)

  // `cids` are ordered the same as `rewardTiers` so can get corresponding values from same index
  return cids
    .map(
      (
        cid,
        index,
      ):
        | JB721TierParams
        | JB_721_TIER_PARAMS_V3_1
        | JB_721_TIER_PARAMS_V3_2 => {
        const rewardTier = sortedRewardTiers[index]
        if (version === JB721_DELEGATE_V3_1) {
          return nftRewardTierToJB721TierParamsV3_1(rewardTier, cid)
        }
        if (version === JB721_DELEGATE_V3_2) {
          return nftRewardTierToJB721TierParamsV3_2(rewardTier, cid)
        }

        // default return v1 params
        return nftRewardTierToJB721TierParamsV3(rewardTier, cid)
      },
    )
    .slice() // clone object
    .sort((a, b) => {
      // bit bongy, sorry!
      if (version === JB721_DELEGATE_V3_2) {
        if (
          (a as JB_721_TIER_PARAMS_V3_2).price.gt(
            (b as JB_721_TIER_PARAMS_V3_2).price,
          )
        )
          return 1
        if (
          (a as JB_721_TIER_PARAMS_V3_2).price.lt(
            (b as JB_721_TIER_PARAMS_V3_2).price,
          )
        )
          return -1
      }

      // Tiers MUST BE in ascending order when sent to contract.
      if (
        (a as JB_721_TIER_PARAMS_V3_1).contributionFloor.gt(
          (b as JB_721_TIER_PARAMS_V3_1).contributionFloor,
        )
      )
        return 1
      if (
        (a as JB_721_TIER_PARAMS_V3_1).contributionFloor.lt(
          (b as JB_721_TIER_PARAMS_V3_1).contributionFloor,
        )
      )
        return -1
      return 0
    })
}

export function encodeJB721DelegateV3PayMetadata(
  metadata: JB721DELAGATE_V3_PAY_METADATA | undefined,
) {
  if (!metadata) return undefined

  const args = [
    constants.HashZero,
    constants.HashZero,
    IJB721Delegate_INTERFACE_ID,
    metadata.dontMint ?? false,
    metadata.expectMintFromExtraFunds ?? false,
    metadata.dontOverspend ?? false,
    metadata.tierIdsToMint,
  ]

  const encoded = defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes4', 'bool', 'bool', 'bool', 'uint16[]'],
    args,
  )

  return encoded
}

export function encodeJB721DelegateV3_1PayMetadata(
  metadata: JB721DELAGATE_V3_1_PAY_METADATA | undefined,
) {
  if (!metadata) return undefined

  const args = [
    constants.HashZero,
    constants.HashZero,
    IJB721Delegate_INTERFACE_ID,
    metadata.allowOverspending ?? DEFAULT_ALLOW_OVERSPENDING,
    metadata.tierIdsToMint,
  ]

  const encoded = defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes4', 'bool', 'uint16[]'],
    args,
  )

  return encoded
}

export function encodeJB721DelegateRedeemMetadata(tokenIdsToRedeem: string[]) {
  const args = [
    constants.HashZero,
    IJB721Delegate_INTERFACE_ID,
    tokenIdsToRedeem,
  ]

  const encoded = defaultAbiCoder.encode(
    ['bytes32', 'bytes4', 'uint256[]'],
    args,
  )

  return encoded
}

export function decodeJB721DelegateRedeemMetadata(
  metadata: string,
): [string, string, BigNumber[]] | undefined {
  try {
    const decoded = defaultAbiCoder.decode(
      ['bytes32', 'bytes4', 'uint256[]'],
      metadata,
    ) as [string, string, BigNumber[]]

    return decoded
  } catch (e) {
    return undefined
  }
}

// returns an array of NftRewardTiers corresponding to a given list of tier IDs
//    Note: If ids contains multiple of the same ID, the return value
//          will contain corresponding rewardTier multiple times.
export function rewardTiersFromIds({
  tierIds,
  rewardTiers,
}: {
  tierIds: number[]
  rewardTiers: NftRewardTier[]
}) {
  return tierIds
    .map(id => rewardTiers.find(tier => tier.id === id))
    .filter(tier => Boolean(tier)) as NftRewardTier[]
}

// sums the contribution floors of a given list of nftRewardTiers
//    - optional select only an array of ids
export function sumTierFloors(
  rewardTiers: NftRewardTier[],
  tierIds?: number[],
) {
  if (tierIds !== undefined && tierIds.length === 0) return 0

  const selectedTiers = tierIds
    ? rewardTiersFromIds({
        tierIds,
        rewardTiers,
      })
    : rewardTiers

  return round(
    selectedTiers.reduce((subSum, tier) => subSum + tier.contributionFloor, 0),
    6,
  )
}

export function buildDeployTiered721DelegateData(
  {
    collectionUri,
    collectionName,
    collectionSymbol,
    tiers,
    ownerAddress,
    governanceType,
    contractAddresses: {
      JBDirectoryAddress,
      JBFundingCycleStoreAddress,
      JBPricesAddress,
      JBTiered721DelegateStoreAddress,
    },
    flags,
  }: {
    collectionUri: string
    collectionName: string
    collectionSymbol: string
    tiers: (
      | JB721TierParams
      | JB_721_TIER_PARAMS_V3_1
      | JB_721_TIER_PARAMS_V3_2
    )[]
    ownerAddress: string
    governanceType: JB721GovernanceType
    contractAddresses: {
      JBDirectoryAddress: string
      JBFundingCycleStoreAddress: string
      JBPricesAddress: string
      JBTiered721DelegateStoreAddress: string
    }
    flags: JBTiered721Flags
  },
  version: JB721DelegateVersion,
): JBDeployTiered721DelegateData | JB_DEPLOY_TIERED_721_DELEGATE_DATA_V3_1 {
  const pricing: JB721PricingParams = {
    tiers,
    currency: V2V3_CURRENCY_ETH,
    decimals: WAD_DECIMALS,
    prices: JBPricesAddress,
  }

  const baseArgs = {
    name: collectionName,
    symbol: collectionSymbol,
    fundingCycleStore: JBFundingCycleStoreAddress,
    baseUri: ipfsUri(''),
    tokenUriResolver: constants.AddressZero,
    contractUri: ipfsUri(collectionUri),
    owner: ownerAddress,
    pricing,
    reservedTokenBeneficiary: constants.AddressZero,
    store: JBTiered721DelegateStoreAddress,
    flags,
    governanceType,
  }

  // Only need to specify directory in V1
  if (version === JB721_DELEGATE_V3) {
    return {
      ...baseArgs,
      directory: JBDirectoryAddress,
    }
  }

  return baseArgs
}

export const fileTypeIsVideo = (fileType: string | undefined) => {
  if (!fileType) return false

  return VIDEO_FILE_TYPES.includes(fileType as NftFileType)
}

export const hasLimitedSupply = (maxSupply: number | undefined) => {
  return Boolean(maxSupply) && maxSupply !== DEFAULT_NFT_MAX_SUPPLY
}
