import { BigNumber } from '@ethersproject/bignumber'

export const formattedBudgetCurrency = (
  curr?: BigNumber | string,
): 'ETH' | 'USD' | undefined => {
  if (!curr) return

  const int = BigNumber.from(curr).toNumber()

  switch (int) {
    case 0:
      return 'ETH'
    case 1:
      return 'USD'
  }
}
