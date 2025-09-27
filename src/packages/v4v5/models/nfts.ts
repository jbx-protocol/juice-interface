import { JBRulesetData, JBRulesetMetadata, jb721TiersHookStoreAbi } from 'juice-sdk-core'
import { JB721GovernanceType, NftCollectionMetadata, NftRewardTier } from 'models/nftRewards'
import { Address, ContractFunctionReturnType } from 'viem'
import { NftPricingContext } from 'packages/v2v3/hooks/JB721Delegate/contractReader/useNftCollectionPricingContext'
import { LaunchV2V3ProjectData } from 'packages/v2v3/hooks/transactor/useLaunchProjectTx'
import { LaunchV4ProjectGroupedSplit } from '../utils/launchProjectTransformers'
import { FundAccessLimitGroup } from './fundAccessLimits'
import { LaunchProjectJBTerminal } from './terminals'
import { V4V5CurrencyOption } from './v4CurrencyOption'

export type V4V5NftRewardsData = {
  rewardTiers: NftRewardTier[] | undefined
  CIDs: string[] | undefined // points to locations of the NFTs' json on IPFS
  collectionMetadata: NftCollectionMetadata
  flags: JB721TiersHookFlags
  governanceType: JB721GovernanceType
  pricing: NftPricingContext
}


/**
 * @see https://github.com/Bananapus/nana-721-hook/blob/main/src/structs/JB721TierConfig.sol
 */
export type JB721TierConfig = {
  price: bigint
  initialSupply: number
  votingUnits: number
  reserveFrequency: number
  reserveBeneficiary: Address
  encodedIPFSUri: `0x${string}`
  category: number
  discountPercent: number
  allowOwnerMint: boolean
  useReserveBeneficiaryAsDefault: boolean
  transfersPausable: boolean
  useVotingUnits: boolean
  cannotBeRemoved: boolean
  cannotIncreaseDiscountPercent: boolean
}

type JB721InitTiersConfig = {
  tiers: JB721TierConfig[]
  currency: number
  decimals: number
  prices: Address // JBPrices address
}

export type JB721TiersHookFlags = {
  noNewTiersWithReserves: boolean
  noNewTiersWithVotes: boolean
  noNewTiersWithOwnerMinting: boolean
  preventOverspending: boolean
}

/**
 *     string name;
    string symbol;
    string baseUri;
    IJB721TokenUriResolver tokenUriResolver;
    string contractUri;
    JB721InitTiersConfig tiersConfig;
    address reserveBeneficiary;
    JB721TiersHookFlags flags;
 */
export type JBDeploy721TiersHookConfig = {
  name: string
  symbol: string
  baseUri: string
  tokenUriResolver: Address //IJB721TokenUriResolver;
  contractUri: string
  tiersConfig: JB721InitTiersConfig
  reserveBeneficiary: Address
  flags: JB721TiersHookFlags
}

export type JBPayDataHookRulesetConfig = JBRulesetData & {
  metadata: JBPayDataHookRulesetMetadata
  memo?: string
  fundAccessLimitGroups: FundAccessLimitGroup[]
  mustStartAtOrAfter?: string // epoch seconds. anything less than "now" will start immediately.
  terminals: string[]
  duration: bigint
  weight: bigint
  weightCutPercent: bigint
  approvalHook: Address
  splitGroups: LaunchV4ProjectGroupedSplit[]
}

interface DeployTiered721DelegateData {
  collectionUri: string
  collectionName: string
  collectionSymbol: string
  currency: V4V5CurrencyOption
  tiers: JB721TierConfig[]
  flags: JB721TiersHookFlags
}

export interface LaunchProjectWithNftsTxArgs {
  tiered721DelegateData: DeployTiered721DelegateData
  projectData: LaunchV2V3ProjectData
}

export type JB721DelegateLaunchProjectData = {
  rulesetConfigurations: JBPayDataHookRulesetConfig[]
  terminalConfigurations: LaunchProjectJBTerminal[]
  projectMetadataUri: string
  memo?: string
}

export type JBPayDataHookRulesetMetadata = Omit<
  JBRulesetMetadata,
  'useDataSourceForPay' | 'dataSource'
>
