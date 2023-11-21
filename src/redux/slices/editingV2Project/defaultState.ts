import { ONE_MILLION } from 'constants/numbers'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { constants } from 'ethers'

import { FEATURE_FLAGS } from 'constants/featureFlags'
import { BigNumber } from 'ethers'
import { JB721GovernanceType, JBTiered721Flags } from 'models/nftRewards'
import {
  LATEST_METADATA_VERSION,
  ProjectMetadata,
} from 'models/projectMetadata'
import { projectDescriptionTemplate } from 'templates/create/projectDescriptionTemplate'
import { featureFlagEnabled } from 'utils/featureFlags'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { issuanceRateFrom, redemptionRateFrom } from 'utils/v2v3/math'
import {
  SerializedV2V3FundingCycleData,
  SerializedV2V3FundingCycleMetadata,
  serializeV2V3FundingCycleData,
  serializeV2V3FundingCycleMetadata,
} from 'utils/v2v3/serializers'
import { CreateState, ProjectState } from './types'

const DEFAULT_DOMAIN = 'juicebox'

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

export const DEFAULT_NFT_PRICING = {
  currency: V2V3_CURRENCY_ETH,
}

export const DEFAULT_NFT_FLAGS: JBTiered721Flags = {
  lockReservedTokenChanges: false,
  lockVotingUnitChanges: false,
  lockManualMintingChanges: false,
  preventOverspending: false,
}

const DEFAULT_PROJECT_METADATA_STATE: ProjectMetadata = {
  name: '',
  infoUri: '',
  logoUri: '',
  coverImageUri: '',
  description: projectDescriptionTemplate(),
  twitter: '',
  discord: '',
  telegram: '',
  tokens: [],
  tags: [],
  projectRequiredOFACCheck: undefined,
  nftPaymentSuccessModal: undefined,
  softTargetAmount: undefined,
  softTargetCurrency: V2V3_CURRENCY_USD.toString(),
  domain: DEFAULT_DOMAIN,
  version: LATEST_METADATA_VERSION,
}

const DEFAULT_CREATE_STATE: CreateState = {
  treasurySelection: undefined,
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
    governanceType: JB721GovernanceType.NONE,
    pricing: featureFlagEnabled(
      FEATURE_FLAGS.JUICE_CROWD_METADATA_CONFIGURATION,
    )
      ? {
          currency: V2V3_CURRENCY_USD,
        }
      : DEFAULT_NFT_PRICING, // TODO add to form,
  },
  mustStartAtOrAfter: DEFAULT_MUST_START_AT_OR_AFTER,
  inputProjectOwner: undefined,
}

export const DEFAULT_REDUX_STATE = {
  ...DEFAULT_PROJECT_STATE,
  ...DEFAULT_CREATE_STATE,
}
