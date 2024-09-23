import round from "lodash/round";
import { otherUnitToSeconds } from "utils/format/formatTime";
import { EditCycleFormFields } from "../views/V4ProjectSettings/EditCyclePage/EditCycleFormFields";

export function transformEditCycleFormFieldsToTxArgs({
  formValues,
  primaryNativeTerminal,
  tokenAddress,
}: {
  formValues: EditCycleFormFields;
  primaryNativeTerminal: `0x${string}`;
  tokenAddress: `0x${string}`;
}) {
  const now = round(new Date().getTime() / 1000);
  const mustStartAtOrAfter = now;

  const duration = otherUnitToSeconds({
    duration: formValues.duration,
    unit: formValues.durationUnit.value,
  })
  const weight = BigInt(formValues.issuanceRate);
  const decayPercent = formValues.decayPercent;
  const approvalHook = formValues.approvalHook;

  const rulesetConfigurations = [
    {
      mustStartAtOrAfter,
      duration,
      weight,
      decayPercent,
      approvalHook,

      metadata: {
        reservedPercent: formValues.reservedPercent,
        redemptionRate: formValues.redemptionRate,
        baseCurrency: 1, // Assuming base currency is a constant value, typically USD
        pausePay: formValues.pausePay,
        pauseRedeem: false, // Defaulting this value since it's not in formValues
        pauseCreditTransfers: !formValues.tokenTransfers,
        allowOwnerMinting: formValues.allowOwnerMinting,
        allowSetCustomToken: false, // Defaulting to false as it's not in formValues
        allowTerminalMigration: formValues.allowTerminalMigration,
        allowSetTerminals: formValues.allowSetTerminals,
        allowSetController: formValues.allowSetController,
        allowAddAccountingContext: false, // Defaulting to false as it's not in formValues
        allowAddPriceFeed: false, // Defaulting to false as it's not in formValues
        ownerMustSendPayouts: false, // Defaulting to false as it's not in formValues
        holdFees: formValues.holdFees,
        useTotalSurplusForRedemptions: false, // Defaulting to false as it's not in formValues
        useDataHookForPay: false, // Defaulting to false as it's not in formValues
        useDataHookForRedeem: false, // Defaulting to false as it's not in formValues
        dataHook: "0x0000000000000000000000000000000000000000" as `0x${string}`, // Defaulting to a null address
        metadata: 0, // Assuming no additional metadata is provided
        allowCrosschainSuckerExtension: false
      },

      splitGroups: [
        {
          groupId: BigInt(1), // Assuming 1 for payout splits
          splits: formValues.payoutSplits.map((split) => ({
            preferAddToBalance: Boolean(split.preferAddToBalance),
            percent: Number(split.percent.value),
            projectId: BigInt(split.projectId),
            beneficiary: split.beneficiary as `0x${string}`,
            lockedUntil: split.lockedUntil ?? 0,
            hook: split.hook as `0x${string}`,
          })),
        },
        {
          groupId: BigInt(2), // Assuming 2 for reserved tokens splits
          splits: formValues.reservedTokensSplits.map((split) => ({
            preferAddToBalance: Boolean(split.preferAddToBalance),
            percent: Number(split.percent.value),
            projectId: BigInt(split.projectId),
            beneficiary: split.beneficiary as `0x${string}`,
            lockedUntil: split.lockedUntil ?? 0,
            hook: split.hook as `0x${string}`,
          })),
        },
      ],

      fundAccessLimitGroups: [
        {
          terminal: primaryNativeTerminal,
          token: tokenAddress,
          payoutLimits: [
            {
              amount: BigInt(formValues.payoutLimit ?? "0"),
              currency: 1, // Assuming currency is constant (e.g., USD)
            },
          ],
          surplusAllowances: [
            {
              amount: BigInt(0), // Assuming no surplus allowances for now
              currency: 1, // Assuming currency is constant (e.g., USD)
            },
          ],
        },
      ],
    },
  ];

  const terminalConfigurations = [
    {
      terminal: primaryNativeTerminal,
      accountingContextsToAccept: [] as const,
    },
  ];

  return [
    BigInt(now), // Convert the current timestamp to bigint for the first argument
    rulesetConfigurations,
    terminalConfigurations,
    formValues.memo ?? "",
  ] as const;
}
