import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { JB721_DELEGATE_V1 } from 'constants/delegateVersions'
import { ONE_MILLION } from 'constants/numbers'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { JB721GovernanceType, JBTiered721Flags } from 'models/nftRewardTier'
import {
  LATEST_METADATA_VERSION,
  ProjectMetadataV6,
} from 'models/project-metadata'
import { issuanceRateFrom, redemptionRateFrom } from 'utils/v2v3/math'
import {
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'
import { CreateState, ProjectState } from './types'

export const DEFAULT_MUST_START_AT_OR_AFTER = '1'
export const DEFAULT_MINT_RATE = ONE_MILLION

export const DEFAULT_FUNDING_CYCLE_DATA: SerializedV2V3FundingCycleData =
  serializeV2V3FundingCycleData({
    duration: BigNumber.from(0),
    weight: BigNumber.from(issuanceRateFrom(DEFAULT_MINT_RATE.toString())), // 1e24, resulting in 1,000,000 tokens per ETH
    discountRate: BigNumber.from(0), // A number from 0-1,000,000,000
    ballot: constants.AddressZero,
  })

export const DEFAULT_FUNDING_CYCLE_METADATA: SerializedV2V3FundingCycleMetadata =
  serializeV2V3FundingCycleMetadata({
    global: {
      allowSetTerminals: false,
      allowSetController: false,
      pauseTransfers: false,
    },
    reservedRate: BigNumber.from(0), // A number from 0-10,000
    redemptionRate: redemptionRateFrom('100'), // A number from 0-10,000
    ballotRedemptionRate: redemptionRateFrom('100'), // A number from 0-10,000
    pausePay: false,
    pauseDistributions: false,
    pauseRedeem: false,
    allowMinting: false,
    pauseBurn: false,
    preferClaimedTokenOverride: false,
    allowTerminalMigration: false,
    allowControllerMigration: false,
    holdFees: false,
    useTotalOverflowForRedemptions: false,
    useDataSourceForPay: false,
    useDataSourceForRedeem: false,
    dataSource: constants.AddressZero,
    metadata: BigNumber.from(0),
  }) ?? {}

export const EMPTY_PAYOUT_GROUPED_SPLITS = {
  group: ETH_PAYOUT_SPLIT_GROUP,
  splits: [],
}

export const EMPTY_RESERVED_TOKENS_GROUPED_SPLITS = {
  group: RESERVED_TOKEN_SPLIT_GROUP,
  splits: [],
}

export const EMPTY_NFT_COLLECTION_METADATA = {
  symbol: undefined,
  name: undefined,
  CID: undefined,
  description: undefined,
}

export const DEFAULT_NFT_FLAGS: JBTiered721Flags = {
  lockReservedTokenChanges: false,
  lockVotingUnitChanges: false,
  lockManualMintingChanges: false,
  preventOverspending: false,
}

const DEFAULT_PROJECT_METADATA_STATE: ProjectMetadataV6 = {
  name: '',
  infoUri: '',
  logoUri: '',
  description: '',
  twitter: '',
  discord: '',
  telegram: '',
  tokens: [],
  nftPaymentSuccessModal: undefined,
  version: LATEST_METADATA_VERSION,
}

const DEFAULT_CREATE_STATE: CreateState = {
  reconfigurationRuleSelection: undefined,
  fundingCyclesPageSelection: undefined,
  createFurthestPageReached: 'projectDetails',
  createSoftLockPageQueue: [],
  fundingTargetSelection: undefined,
  payoutsSelection: undefined,
  projectTokensSelection: undefined,
}

const DEFAULT_PROJECT_STATE: ProjectState = {
  projectMetadata: { ...DEFAULT_PROJECT_METADATA_STATE },
  fundingCycleData: { ...DEFAULT_FUNDING_CYCLE_DATA },
  fundingCycleMetadata: { ...DEFAULT_FUNDING_CYCLE_METADATA },
  fundAccessConstraints: [],
  payoutGroupedSplits: EMPTY_PAYOUT_GROUPED_SPLITS,
  reservedTokensGroupedSplits: EMPTY_RESERVED_TOKENS_GROUPED_SPLITS,
  nftRewards: {
    rewardTiers: [],
    CIDs: undefined,
    collectionMetadata: EMPTY_NFT_COLLECTION_METADATA,
    postPayModal: undefined,
    flags: DEFAULT_NFT_FLAGS,
    contractVersion: JB721_DELEGATE_V1,
    governanceType: JB721GovernanceType.NONE,
  },
  mustStartAtOrAfter: DEFAULT_MUST_START_AT_OR_AFTER,
  inputProjectOwner: undefined,
}

export const DEFAULT_REDUX_STATE = {
  ...DEFAULT_PROJECT_STATE,
  ...DEFAULT_CREATE_STATE,
}
