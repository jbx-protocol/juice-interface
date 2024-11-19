import { JBRulesetData, JBRulesetMetadata } from 'juice-sdk-core'

import { jb721TiersHookStoreAbi } from 'juice-sdk-react'
import { LaunchV2V3ProjectData } from 'packages/v2v3/hooks/transactor/useLaunchProjectTx'
import { Address, ContractFunctionReturnType } from 'viem'
import { LaunchV4ProjectGroupedSplit } from '../utils/launchProjectTransformers'
import { FundAccessLimitGroup } from './fundAccessLimits'
import { LaunchProjectJBTerminal } from './terminals'
import { V4CurrencyOption } from './v4CurrencyOption'

type JB721TierParams = Omit<
  ContractFunctionReturnType<
    typeof jb721TiersHookStoreAbi,
    'view',
    'tiersOf'
  >[0],
  'id'
>

type JB721InitTiersConfig = {
  tiers: JB721TierParams[]
  currency: number
  decimals: number
  prices: Address
}

type JB721TiersHookFlags = {
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
  decayPercent: bigint
  approvalHook: Address
  splitGroups: LaunchV4ProjectGroupedSplit[]
}

interface DeployTiered721DelegateData {
  collectionUri: string
  collectionName: string
  collectionSymbol: string
  currency: V4CurrencyOption
  tiers: JB721TierParams[]
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
