export type FundAccessLimitGroup = {
  terminal: `0x${string}`;
  token: `0x${string}`;
  payoutLimits: {
      amount: bigint;
      currency: number;
  }[];
  surplusAllowances: {
      amount: bigint;
      currency: number;
  }[];
}
