import { Address } from 'viem';

export type LaunchProjectJBTerminal = {
  terminal: Address;
  accountingContextsToAccept: {
      token: `0x${string}`;
      decimals: 18;
      currency: number;
  }[];
}
