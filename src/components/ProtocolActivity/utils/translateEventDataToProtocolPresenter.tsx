import { BigNumber } from '@ethersproject/bignumber'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { AnyEvent } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/utils/transformEventsData'
import { formatActivityAmount } from 'utils/format/formatActivityAmount'

// Known currency addresses to symbol mapping (lowercase addresses)
const CURRENCY_SYMBOLS: Record<string, string> = {
  '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913': 'USDC', // Base USDC
  '0x0000000000000000000000000000000000000000': 'ETH', // Native ETH
}

/**
 * Get currency symbol from currency address (hex string)
 */
function getCurrencySymbol(currency?: string | null): string {
  if (!currency) return 'ETH'
  // Normalize to lowercase for lookup
  const symbol = CURRENCY_SYMBOLS[currency.toLowerCase()]
  return symbol || 'ETH'
}

/**
 * Translate event data to protocol activity presenter with formatted amounts
 */
export function translateEventDataToProtocolPresenter(event: AnyEvent) {
  // Use projectToken (the actual token address) for currency symbol lookup
  const currencySymbol = getCurrencySymbol(event.projectToken)

  switch (event.type) {
    case 'payEvent':
      return {
        event,
        header: 'Paid',
        subject: `${formatActivityAmount(event.amount.value)} ${currencySymbol}`,
      }
    case 'addToBalanceEvent':
      return {
        event,
        header: 'Added to balance',
        subject: `${formatActivityAmount(event.amount.value)} ${currencySymbol}`,
      }
    case 'manualMintTokensEvent':
      return {
        event,
        header: 'Minted tokens',
        subject: `${formatActivityAmount(event.amount.value)} tokens`,
      }
    case 'cashOutEvent':
      return {
        event,
        header: 'Cashed out',
        subject: `${formatActivityAmount(event.reclaimAmount.value)} ${currencySymbol}`,
      }
    case 'deployedERC20Event':
      return {
        event,
        header: 'Deployed ERC20',
        subject: event.symbol,
      }
    case 'projectCreateEvent':
      return {
        event,
        header: 'Created',
        subject: 'Project created',
      }
    case 'distributePayoutsEvent':
      return {
        event,
        header: 'Send payouts',
        subject: `${formatActivityAmount(event.amount.value)} ${currencySymbol}`,
      }
    case 'distributeReservedTokensEvent':
      return {
        event,
        header: 'Send reserved tokens',
        subject: `${formatActivityAmount(event.tokenCount)} tokens`,
      }
    case 'distributeToReservedTokenSplitEvent':
      return {
        event,
        header: 'Send to reserved token split',
        subject: `${formatActivityAmount(event.tokenCount)} tokens`,
      }
    case 'distributeToPayoutSplitEvent':
      return {
        event,
        header: 'Send to payout split',
        subject: `${formatActivityAmount(event.amount.value)} ${currencySymbol}`,
      }
    case 'useAllowanceEvent':
      return {
        event,
        header: 'Used allowance',
        subject: `${formatActivityAmount(event.amount.value)} ${currencySymbol}`,
      }
    case 'manualBurnEvent':
      return {
        event,
        header: 'Burned',
        subject: `${formatActivityAmount(event.amount.value)} tokens`,
      }
  }
}
