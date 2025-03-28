import { TransactionCallbacks } from 'models/transaction'
import { useLaunchProjectWithNftsTx } from 'packages/v2v3/hooks/JB721Delegate/transactor/useLaunchProjectWithNftsTx'
import { DEFAULT_JB_721_DELEGATE_VERSION } from 'packages/v2v3/hooks/defaultContracts/useDefaultJB721Delegate'
import { useCallback, useMemo } from 'react'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  useCreatingV2V3FundAccessConstraintsSelector,
  useCreatingV2V3FundingCycleDataSelector,
  useCreatingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/v2v3/create'
import { DEFAULT_NFT_FLAGS } from 'redux/slices/v2v3/creatingV2Project'
import { NFT_FUNDING_CYCLE_METADATA_OVERRIDES } from 'utils/nftFundingCycleMetadataOverrides'
import { buildJB721TierParams } from 'utils/nftRewards'

/**
 * Hook that returns a function that deploys a project with NFT rewards.

 * The distinction is made between standard and NFT projects because the NFT
 * project contract uses more gas.
 * @returns A function that deploys a project with NFT rewards.
  */
export const useDeployNftProject = () => {
  const launchProjectWithNftsTx = useLaunchProjectWithNftsTx()
  const {
    projectMetadata,
    nftRewards,
    payoutGroupedSplits,
    reservedTokensGroupedSplits,
    inputProjectOwner,
    mustStartAtOrAfter,
  } = useAppSelector(state => state.creatingV2Project)
  const fundingCycleMetadata = useCreatingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useCreatingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useCreatingV2V3FundAccessConstraintsSelector()

  const collectionName = useMemo(
    () =>
      nftRewards.collectionMetadata.name
        ? nftRewards.collectionMetadata.name
        : projectMetadata.name,
    [nftRewards.collectionMetadata.name, projectMetadata.name],
  )
  const collectionSymbol = useMemo(
    () => nftRewards.collectionMetadata.symbol ?? '',
    [nftRewards.collectionMetadata.symbol],
  )
  const nftFlags = useMemo(
    () => nftRewards.flags ?? DEFAULT_NFT_FLAGS,
    [nftRewards.flags],
  )
  const governanceType = nftRewards.governanceType
  const currency = nftRewards.pricing.currency

  /**
   * Deploy a project with NFT rewards.
   * @param metadataCid IPFS CID of the project metadata.
   * @param rewardTierCids IPFS CIDs of the reward tiers.
   * @param nftCollectionMetadataCid IPFS CID of the NFT collection metadata.
   */
  const deployNftProjectCallback = useCallback(
    async ({
      metadataCid,
      rewardTierCids,
      nftCollectionMetadataUri,

      onDone,
      onConfirmed,
      onCancelled,
      onError,
    }: {
      metadataCid: string
      rewardTierCids: string[]
      nftCollectionMetadataUri: string
    } & TransactionCallbacks) => {
      if (!collectionName) throw new Error('No collection name or project name')
      if (!(rewardTierCids.length && nftRewards.rewardTiers))
        throw new Error('No NFTs')

      const groupedSplits = [payoutGroupedSplits, reservedTokensGroupedSplits]
      const tiers = buildJB721TierParams({
        cids: rewardTierCids,
        rewardTiers: nftRewards.rewardTiers,
        version: DEFAULT_JB_721_DELEGATE_VERSION,
      })

      return await launchProjectWithNftsTx(
        {
          tiered721DelegateData: {
            collectionUri: nftCollectionMetadataUri,
            collectionName,
            collectionSymbol,
            currency,
            governanceType,
            tiers,
            flags: nftFlags,
          },
          projectData: {
            owner: inputProjectOwner?.length ? inputProjectOwner : undefined,
            projectMetadataCID: metadataCid,
            fundingCycleData,
            mustStartAtOrAfter,
            fundingCycleMetadata: {
              ...fundingCycleMetadata,
              ...NFT_FUNDING_CYCLE_METADATA_OVERRIDES,
            },
            fundAccessConstraints,
            groupedSplits,
          },
        },
        {
          onDone,
          onConfirmed,
          onCancelled,
          onError,
        },
      )
    },
    [
      collectionName,
      nftRewards.rewardTiers,
      currency,
      payoutGroupedSplits,
      reservedTokensGroupedSplits,
      launchProjectWithNftsTx,
      collectionSymbol,
      governanceType,
      inputProjectOwner,
      fundingCycleData,
      mustStartAtOrAfter,
      fundingCycleMetadata,
      fundAccessConstraints,
      nftFlags,
    ],
  )

  return deployNftProjectCallback
}
