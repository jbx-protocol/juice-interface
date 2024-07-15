import { RedemptionRate, ReservedRate } from "juice-sdk-core";

export type RulesetMetadata = {
  reservedRate: ReservedRate;
  redemptionRate: RedemptionRate;
  baseCurrency: bigint;
  pausePay: boolean;
  pauseCreditTransfers: boolean;
  allowOwnerMinting: boolean;
  allowSetCustomToken: boolean;
  allowTerminalMigration: boolean;
  allowSetTerminals: boolean;
  allowSetController: boolean;
  allowAddAccountingContext: boolean;
  allowAddPriceFeed: boolean;
  ownerMustSendPayouts: boolean;
  holdFees: boolean;
  useTotalSurplusForRedemptions: boolean;
  useDataHookForPay: boolean;
  useDataHookForRedeem: boolean;
  dataHook: string;
  metadata: bigint;
}
