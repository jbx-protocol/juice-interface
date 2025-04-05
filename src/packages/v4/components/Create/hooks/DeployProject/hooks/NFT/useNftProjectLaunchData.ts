import { DEFAULT_JB_721_TIER_CATEGORY } from 'constants/transactionDefaults'
import {
  createSalt,
  jbProjectDeploymentAddresses,
  NATIVE_TOKEN_DECIMALS,
} from 'juice-sdk-core'
import { JBChainId, jbPricesAddress } from 'juice-sdk-react'
import { JBTiered721Flags, NftRewardTier } from 'models/nftRewards'
import {
  JB721TierConfig,
  JB721TiersHookFlags,
  JBDeploy721TiersHookConfig,
} from 'packages/v4/models/nfts'
import { convertV2V3CurrencyOptionToV4 } from 'packages/v4/utils/currency'
import { isValidMustStartAtOrAfter } from 'packages/v4/utils/fundingCycle'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useCreatingV2V3FundingCycleDataSelector } from 'redux/hooks/v2v3/create'
import { DEFAULT_NFT_FLAGS } from 'redux/slices/v2v3/creatingV2Project'
import { encodeIpfsUri, ipfsUri } from 'utils/ipfs'
import { sortNftsByContributionFloor } from 'utils/nftRewards'
import { Address, parseEther, zeroAddress } from 'viem'
import { useStandardProjectLaunchData } from '../useStandardProjectLaunchData'
import { DEFAULT_NFT_MAX_SUPPLY } from './useDeployNftProject'

export function useNftProjectLaunchData() {
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
  const currency = convertV2V3CurrencyOptionToV4(nftRewards.pricing.currency)

  return ({
    projectMetadataCID,
    rewardTierCids,
    nftCollectionMetadataUri,
    chainId,
  }: {
    projectMetadataCID: string
    nftCollectionMetadataUri: string
    rewardTierCids: string[]
    chainId: JBChainId
  }) => {
    const defaultJBController = chainId
      ? (jbProjectDeploymentAddresses.JBController[
          chainId as JBChainId
        ] as Address)
      : undefined

    if (
      !defaultJBController ||
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

    const deployTiered721HookData: JBDeploy721TiersHookConfig = {
      name: collectionName,
      symbol: collectionSymbol,
      baseUri: ipfsUri(''),
      tokenUriResolver: zeroAddress,
      contractUri: ipfsUri(nftCollectionMetadataUri),
      tiersConfig: {
        currency,
        decimals: NATIVE_TOKEN_DECIMALS,
        prices: jbPricesAddress[chainId as JBChainId],
        tiers,
      },
      reserveBeneficiary: zeroAddress,
      flags,
    }

    const { args: standardProjLaunchData } = getStandardProjectLaunchData({
      projectMetadataCID,
      chainId,
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
}): JB721TierConfig[] {
  const sortedRewardTiers = sortNftsByContributionFloor(rewardTiers)

  return cids.map((cid, index) => {
    const rewardTier = sortedRewardTiers[index]

    return nftRewardTierToJB721TierConfig(rewardTier, cid)
  })
}

function toV4Flags(v2v3Flags: JBTiered721Flags): JB721TiersHookFlags {
  return {
    noNewTiersWithOwnerMinting: v2v3Flags.lockManualMintingChanges,
    noNewTiersWithReserves: v2v3Flags.lockReservedTokenChanges,
    noNewTiersWithVotes: v2v3Flags.lockVotingUnitChanges,
    preventOverspending: v2v3Flags.preventOverspending,
  }
}

function nftRewardTierToJB721TierConfig(
  rewardTier: NftRewardTier,
  cid: string,
): JB721TierConfig {
  const price = parseEther(rewardTier.contributionFloor.toString())
  const initialSupply = rewardTier.maxSupply ?? DEFAULT_NFT_MAX_SUPPLY
  const encodedIPFSUri = encodeIpfsUri(cid)

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
    encodedIPFSUri,
    allowOwnerMint: false,
    useReserveBeneficiaryAsDefault: false,
    transfersPausable: false,
    useVotingUnits: true,
    cannotBeRemoved: false,
    cannotIncreaseDiscountPercent: false,
    discountPercent: 0,
    remainingSupply: initialSupply,
    category: DEFAULT_JB_721_TIER_CATEGORY,
    resolvedUri: '',
  }
}
