import { BigNumber } from '@ethersproject/bignumber'
import { AmountInCurrency } from 'components/currency/AmountInCurrency'
import { AnyEvent } from 'packages/v4v5/views/V4V5ProjectDashboard/V4V5ProjectTabs/V4V5ActivityPanel/utils/transformEventsData'
import { formatActivityAmount } from 'utils/format/formatActivityAmount'

/**
 * Translate event data to protocol activity presenter with formatted amounts
 */
export function translateEventDataToProtocolPresenter(event: AnyEvent) {
  switch (event.type) {
    case 'payEvent':
      return {
        event,
        header: 'Paid',
        subject: `${formatActivityAmount(event.amount.value)} ETH`,
      }
    case 'addToBalanceEvent':
      return {
        event,
        header: 'Added to balance',
        subject: `${formatActivityAmount(event.amount.value)} ETH`,
      }
    case 'mintTokensEvent':
      return {
        event,
        header: 'Minted tokens',
        subject: `${formatActivityAmount(event.amount.value)} tokens`,
      }
    case 'cashOutEvent':
      return {
        event,
        header: 'Cashed out',
        subject: `${formatActivityAmount(event.reclaimAmount.value)} ETH`,
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
        subject: `${formatActivityAmount(event.amount.value)} ETH`,
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
        subject: `${formatActivityAmount(event.amount.value)} ETH`,
      }
    case 'useAllowanceEvent':
      return {
        event,
        header: 'Used allowance',
        subject: `${formatActivityAmount(event.amount.value)} ETH`,
      }
    case 'burnEvent':
      return {
        event,
        header: 'Burned',
        subject: `${formatActivityAmount(event.amount.value)} tokens`,
      }
  }
}
