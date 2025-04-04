import { JBTiered721Flags, NftRewardTier } from 'models/nftRewards'
import { JB721TierConfig, JB721TiersHookFlags } from 'packages/v4/models/nfts'
import { Address, parseEther, zeroAddress } from 'viem'

import { ONE_BILLION } from 'constants/numbers'
import { DEFAULT_JB_721_TIER_CATEGORY } from 'constants/transactionDefaults'
import { JBChainId } from 'juice-sdk-react'
import { useLaunchProjectWithNftsTx } from 'packages/v4/hooks/JB721Delegate/transactor/useLaunchProjectWithNftsTx'
import { LaunchTxOpts } from 'packages/v4/hooks/useLaunchProjectTx'
import { useCallback } from 'react'
import { encodeIpfsUri } from 'utils/ipfs'
import { sortNftsByContributionFloor } from 'utils/nftRewards'

export const DEFAULT_NFT_MAX_SUPPLY = ONE_BILLION - 1

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

/**
 * Hook that returns a function that deploys a project with NFT rewards.

 * The distinction is made between standard and NFT projects because the NFT
 * project contract uses more gas.
 * @returns A function that deploys a project with NFT rewards.
  */
export const useDeployNftProject = () => {
  const launchProjectWithNftsTx = useLaunchProjectWithNftsTx()

  /**
   * Deploy a project with NFT rewards.
   * @param metadataCid IPFS CID of the project metadata.
   * @param rewardTierCids IPFS CIDs of the reward tiers.
   * @param nftCollectionMetadataCid IPFS CID of the NFT collection metadata.
   */
  const deployNftProjectCallback = useCallback(
    async ({
      chainId,
      metadataCid,
      rewardTierCids,
      nftCollectionMetadataUri,

      onTransactionPending,
      onTransactionConfirmed,
      onTransactionError,
    }: {
      chainId: JBChainId
      metadataCid: string
      rewardTierCids: string[]
      nftCollectionMetadataUri: string
    } & LaunchTxOpts) => {
      if (!rewardTierCids.length) {
        throw new Error('No NFTs')
      }

      return await launchProjectWithNftsTx(
        chainId,
        {
          projectMetadataCID: metadataCid,
          rewardTierCids,
          nftCollectionMetadataUri,
        },
        {
          onTransactionPending,
          onTransactionConfirmed,
          onTransactionError,
        },
      )
    },
    [launchProjectWithNftsTx],
  )

  return deployNftProjectCallback
}
