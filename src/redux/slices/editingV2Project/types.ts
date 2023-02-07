import { CreatePage } from 'models/create-page'
import { FundingTargetType } from 'models/fundingTargetType'
import {
  DelegateVersion,
  JB721GovernanceType,
  JBTiered721Flags,
  NftCollectionMetadata,
  NftPostPayModalConfig,
  NftRewardTier,
} from 'models/nftRewardTier'
import { PayoutsSelection } from 'models/payoutsSelection'
import { ProjectMetadataV5 } from 'models/project-metadata'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'models/splits'
import {
  SerializedV2V3FundAccessConstraint,
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'

export type NftRewardsData = {
  rewardTiers: NftRewardTier[] | undefined
  CIDs: string[] | undefined // points to locations of the NFTs' json on IPFS
  collectionMetadata: NftCollectionMetadata
  postPayModal: NftPostPayModalConfig | undefined
  flags: JBTiered721Flags
  contractVersion: DelegateVersion | undefined
  governanceType: JB721GovernanceType
}

export interface CreateState {
  fundingCyclesPageSelection: 'automated' | 'manual' | undefined
  fundingTargetSelection: FundingTargetType | undefined
  payoutsSelection: PayoutsSelection | undefined
  projectTokensSelection: ProjectTokensSelection | undefined
  reconfigurationRuleSelection: ReconfigurationStrategy | undefined
  createFurthestPageReached: CreatePage
  createSoftLockPageQueue: CreatePage[] | undefined
}

export interface ProjectState {
  projectMetadata: ProjectMetadataV5
  fundingCycleData: SerializedV2V3FundingCycleData
  fundingCycleMetadata: SerializedV2V3FundingCycleMetadata
  fundAccessConstraints: SerializedV2V3FundAccessConstraint[]
  payoutGroupedSplits: ETHPayoutGroupedSplits
  reservedTokensGroupedSplits: ReservedTokensGroupedSplits
  nftRewards: NftRewardsData
  mustStartAtOrAfter: string
  inputProjectOwner: string | undefined
}

export interface ReduxState extends CreateState, ProjectState {
  version: string
}
