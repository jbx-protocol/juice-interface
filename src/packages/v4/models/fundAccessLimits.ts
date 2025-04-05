import { V4CurrencyOption } from "./v4CurrencyOption";

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

export interface ReduxPayoutLimit {
  amount: bigint
  currency: V4CurrencyOption
}
