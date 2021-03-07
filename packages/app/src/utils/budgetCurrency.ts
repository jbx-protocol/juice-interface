import { BudgetCurrency } from 'models/budget-currency'

export const formattedBudgetCurrency = (
  curr?: BudgetCurrency,
): string | undefined => {
  switch (curr) {
    case '0':
      return 'ETH'
    case '1':
      return 'USD'
  }
}
