import {
  createSalt,
  jbContractAddress,
  JBCoreContracts,
  NATIVE_TOKEN_DECIMALS,
} from '@bananapus/nana-sdk-core'
import { JBChainId } from '@bananapus/nana-sdk-react'
import { JBTiered721Flags, NftRewardTier } from 'models/nftRewards'
import {
  JB721TierConfig,
  JB721TiersHookFlags,
  JBDeploy721TiersHookConfig,
} from 'packages/v4v5/models/nfts'
import { encodeIpfsUri, ipfsUri } from 'utils/ipfs'
import { Address, parseEther, zeroAddress } from 'viem'

import { DEFAULT_JB_721_TIER_CATEGORY } from 'constants/transactionDefaults'
import { convertV2V3CurrencyOptionToV4V5 } from 'packages/v4v5/utils/currency'
import { isValidMustStartAtOrAfter } from 'packages/v4v5/utils/fundingCycle'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useCreatingV2V3FundingCycleDataSelector } from 'redux/hooks/v2v3/create'
import { DEFAULT_NFT_FLAGS } from 'redux/slices/v2v3/creatingV2Project'
import { sortNftsByContributionFloor } from 'utils/nftRewards'
import { useStandardProjectLaunchData } from '../useStandardProjectLaunchData'
import { DEFAULT_NFT_MAX_SUPPLY } from './useDeployNftProject'
import { useV4V5Version } from 'packages/v4v5/contexts/V4V5VersionProvider'

// v6: JB721TierConfig drifted (encodedIpfsUri casing, nested flags tuple with cant*
// naming, new splitPercent/splits fields) and JB721InitTiersConfig dropped `prices`.
// We emit BOTH the v5 and v6 key spellings on the same object so it encodes correctly
// under whichever ABI the caller picks by version (viem selects tuple fields by name).
type JB721TierConfigDual = JB721TierConfig & {
  encodedIpfsUri: `0x${string}`
  splitPercent: number
  splits: never[]
  flags: {
    allowOwnerMint: boolean
    useReserveBeneficiaryAsDefault: boolean
    transfersPausable: boolean
    useVotingUnits: boolean
    cantBeRemoved: boolean
    cantIncreaseDiscountPercent: boolean
    cantBuyWithCredits: boolean
  }
}

type JB721TiersHookFlagsDual = JB721TiersHookFlags & {
  issueTokensForSplits: boolean
}

type JBDeploy721TiersHookConfigDual = Omit<
  JBDeploy721TiersHookConfig,
  'tiersConfig' | 'flags'
> & {
  tiersConfig: Omit<JBDeploy721TiersHookConfig['tiersConfig'], 'tiers'> & {
    tiers: JB721TierConfigDual[]
  }
  flags: JB721TiersHookFlagsDual
}

export function useNftProjectLaunchData() {
  const { version } = useV4V5Version()
  const { projectMetadata, nftRewards, mustStartAtOrAfter } = useAppSelector(
    state => state.creatingV2Project,
  )
  const getStandardProjectLaunchData = useStandardProjectLaunchData()
  const fundingCycleData = useCreatingV2V3FundingCycleDataSelector()

  const collectionName = nftRewards.collectionMetadata.name
    ? nftRewards.collectionMetadata.name
    : projectMetadata.name
  const collectionSymbol = nftRewards.collectionMetadata.symbol ?? ''
  const nftFlags = nftRewards.flags ?? DEFAULT_NFT_FLAGS
  // const governanceType = nftRewards.governanceType
  const currency = convertV2V3CurrencyOptionToV4V5(nftRewards.pricing.currency, version)

  return ({
    projectMetadataCID,
    rewardTierCids,
    nftCollectionMetadataUri,
    chainId,
    /**
     * Add a x minute buffer to the start time of the project.
     */
    withStartBuffer,
  }: {
    projectMetadataCID: string
    nftCollectionMetadataUri: string
    rewardTierCids: string[]
    chainId: JBChainId
    withStartBuffer?: boolean
  }) => {
    // Use version-specific JBController
    const defaultJBController = jbContractAddress[version.toString() as '4' | '5' | '6'][
      JBCoreContracts.JBController
    ][chainId as JBChainId] as Address

    if (
      !isValidMustStartAtOrAfter(
        BigInt(mustStartAtOrAfter),
        BigInt(fundingCycleData.duration.toString()),
      )
    ) {
      throw new Error(`Error deploying project: Missing required parameter`)
    }

    if (!collectionName) throw new Error('No collection name or project name')
    if (!(rewardTierCids.length && nftRewards.rewardTiers))
      throw new Error('No NFTs')

    const tiers = buildJB721TierParams({
      cids: rewardTierCids,
      rewardTiers: nftRewards.rewardTiers,
    })
    const flags = toV4Flags(nftFlags)

    const deployTiered721HookData: JBDeploy721TiersHookConfigDual = {
      name: collectionName,
      symbol: collectionSymbol,
      baseUri: ipfsUri(''),
      tokenUriResolver: zeroAddress,
      contractUri: ipfsUri(nftCollectionMetadataUri),
      tiersConfig: {
        currency,
        decimals: NATIVE_TOKEN_DECIMALS,
        // v5 only: v6's JB721InitTiersConfig has no `prices` field (ignored by the v6 ABI).
        prices: jbContractAddress[version.toString() as '4' | '5' | '6'][JBCoreContracts.JBPrices][
          chainId as JBChainId
        ] as Address,
        tiers,
      },
      // v5 only: dropped from the v6 struct (ignored by the v6 ABI).
      reserveBeneficiary: zeroAddress,
      flags,
    }

    const { args: standardProjLaunchData } = getStandardProjectLaunchData({
      projectMetadataCID,
      chainId,
      withStartBuffer,
    })

    const args = [
      standardProjLaunchData[0],
      deployTiered721HookData, //_deployTiered721HookData
      {
        projectUri: standardProjLaunchData[1],
        rulesetConfigurations: standardProjLaunchData[2],
        terminalConfigurations: standardProjLaunchData[3],
        memo: standardProjLaunchData[4],
      }, // _launchProjectData,
      defaultJBController,
      createSalt(),
    ] as const

    return {
      args,
    }
  }
}

function buildJB721TierParams({
  cids, // MUST BE SORTED BY CONTRIBUTION FLOOR (TODO: not ideal)
  rewardTiers,
}: {
  cids: string[]
  rewardTiers: NftRewardTier[]
}): JB721TierConfigDual[] {
  const sortedRewardTiers = sortNftsByContributionFloor(rewardTiers)

  return cids.map((cid, index) => {
    const rewardTier = sortedRewardTiers[index]

    return nftRewardTierToJB721TierConfig(rewardTier, cid)
  })
}

function toV4Flags(v2v3Flags: JBTiered721Flags): JB721TiersHookFlagsDual {
  return {
    noNewTiersWithOwnerMinting: v2v3Flags.lockManualMintingChanges,
    noNewTiersWithReserves: v2v3Flags.lockReservedTokenChanges,
    noNewTiersWithVotes: v2v3Flags.lockVotingUnitChanges,
    preventOverspending: v2v3Flags.preventOverspending,
    // v6 only: keep reserved-split minting off (matches v5 behavior).
    issueTokensForSplits: false,
  }
}

function nftRewardTierToJB721TierConfig(
  rewardTier: NftRewardTier,
  cid: string,
): JB721TierConfigDual {
  const price = parseEther(rewardTier.contributionFloor.toString())
  const initialSupply = rewardTier.maxSupply ?? DEFAULT_NFT_MAX_SUPPLY
  const encodedIPFSUri = encodeIpfsUri(cid) as `0x${string}`

  const reserveFrequency = rewardTier.reservedRate
    ? rewardTier.reservedRate - 1
    : 0
  const reserveBeneficiary =
    (rewardTier.beneficiary as Address | undefined) ?? zeroAddress
  const votingUnits = parseInt(rewardTier.votingWeight ?? '0')
  // should default to 0, with useVotingUnits `true`, to save gas

  return {
    price,
    initialSupply,
    votingUnits,
    reserveFrequency,
    reserveBeneficiary,
    // v5 spelling.
    encodedIPFSUri,
    // v6 spelling.
    encodedIpfsUri: encodedIPFSUri,
    // v5 flat flags.
    allowOwnerMint: false,
    useReserveBeneficiaryAsDefault: false,
    transfersPausable: false,
    useVotingUnits: true,
    cannotBeRemoved: false,
    cannotIncreaseDiscountPercent: false,
    // v6 nested flags tuple.
    flags: {
      allowOwnerMint: false,
      useReserveBeneficiaryAsDefault: false,
      transfersPausable: false,
      useVotingUnits: true,
      cantBeRemoved: false,
      cantIncreaseDiscountPercent: false,
      cantBuyWithCredits: false,
    },
    // v6 only: no per-tier splits.
    splitPercent: 0,
    splits: [],
    discountPercent: 0,
    category: DEFAULT_JB_721_TIER_CATEGORY,
  }
}
