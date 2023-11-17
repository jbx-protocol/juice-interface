import { DEFAULT_JB_721_DELEGATE_VERSION } from 'hooks/defaultContracts/useDefaultJB721Delegate'
import { useLaunchProjectWithNftsTx } from 'hooks/JB721Delegate/transactor/useLaunchProjectWithNftsTx'
import { TransactionCallbacks } from 'models/transaction'
import { useCallback, useMemo } from 'react'
import {
  useAppSelector,
  useEditingV2V3FundAccessConstraintsSelector,
  useEditingV2V3FundingCycleDataSelector,
  useEditingV2V3FundingCycleMetadataSelector,
} from 'redux/hooks/useAppSelector'
import { DEFAULT_NFT_FLAGS } from 'redux/slices/editingV2Project'
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
  } = useAppSelector(state => state.editingV2Project)
  const fundingCycleMetadata = useEditingV2V3FundingCycleMetadataSelector()
  const fundingCycleData = useEditingV2V3FundingCycleDataSelector()
  const fundAccessConstraints = useEditingV2V3FundAccessConstraintsSelector()

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
