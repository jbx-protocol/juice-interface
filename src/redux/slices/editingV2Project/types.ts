import { NftPricingContext } from 'hooks/JB721Delegate/contractReader/useNftCollectionPricingContext'
import { CreatePage } from 'models/createPage'
import { FundingTargetType } from 'models/fundingTargetType'
import {
  JB721GovernanceType,
  JBTiered721Flags,
  NftCollectionMetadata,
  NftPostPayModalConfig,
  NftRewardTier,
} from 'models/nftRewards'
import { PayoutsSelection } from 'models/payoutsSelection'
import { ProjectMetadata } from 'models/projectMetadata'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'
import {
  ETHPayoutGroupedSplits,
  ReservedTokensGroupedSplits,
} from 'models/splits'
import { TreasurySelection } from 'models/treasurySelection'
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
  governanceType: JB721GovernanceType
  pricing: NftPricingContext
}

export interface CreateState {
  fundingCyclesPageSelection: 'automated' | 'manual' | undefined
  treasurySelection: TreasurySelection | undefined
  fundingTargetSelection: FundingTargetType | undefined
  payoutsSelection: PayoutsSelection | undefined
  projectTokensSelection: ProjectTokensSelection | undefined
  reconfigurationRuleSelection: ReconfigurationStrategy | undefined
  createFurthestPageReached: CreatePage
  createSoftLockPageQueue: CreatePage[] | undefined
}

export interface ProjectState {
  projectMetadata: ProjectMetadata
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
