import { JBRulesetData, JBRulesetMetadata } from "juice-sdk-core";

import { LaunchV2V3ProjectData } from "packages/v2v3/hooks/transactor/useLaunchProjectTx";
import { Address } from "viem";
import { LaunchV4ProjectGroupedSplit } from "../utils/launchProjectTransformers";
import { FundAccessLimitGroup } from "./fundAccessLimits";
import { LaunchProjectJBTerminal } from "./terminals";

export type JBDeploy721TiersHookConfig = {
  name: string;
  symbol: string;
  baseUri: string;
  tokenUriResolver: string;//IJB721TokenUriResolver;
  contractUri: string;
  // tiersConfig: //JB721InitTiersConfig;
  reserveBeneficiary: Address;
  // flags// JB721TiersHookFlags;
}

export type JBPayDataHookRulesetConfig = JBRulesetData & {
  metadata: JBPayDataHookRulesetMetadata;
  memo?: string;
  fundAccessLimitGroups: FundAccessLimitGroup[];
  mustStartAtOrAfter?: string; // epoch seconds. anything less than "now" will start immediately.
  terminals: string[];
  duration: bigint;
  weight: bigint;
  decayPercent: bigint;
  approvalHook: Address;
  splitGroups: LaunchV4ProjectGroupedSplit[];
}

export interface LaunchProjectWithNftsTxArgs {
  tiered721DelegateData: JBDeploy721TiersHookConfig;
  projectData: LaunchV2V3ProjectData;
}

export type JB721DelegateLaunchProjectData = {
  rulesetConfigurations: JBPayDataHookRulesetConfig[];
  terminalConfigurations: LaunchProjectJBTerminal[];
  projectMetadataUri: string;
  memo?: string;
}

export type JBPayDataHookRulesetMetadata = Omit<
  JBRulesetMetadata,
  'useDataSourceForPay' | 'dataSource'
>
