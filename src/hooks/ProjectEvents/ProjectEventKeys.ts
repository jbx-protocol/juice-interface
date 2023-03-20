import { useMemo } from 'react'
import {
  ADD_TO_BALANCE_EVENT_KEY,
  BURN_EVENT_KEY,
  DEPLOYED_ERC20_EVENT_KEY,
  DEPLOYED_PROJECT_PAYER_EVENT_KEY,
  PAY_EVENT_KEY,
  PROJECT_CREATE_EVENT_KEY,
  REDEEM_EVENT_KEY
} from './constants/sharedEntityKeys'
import {
  PRINT_RESERVES_EVENT_KEY,
  TAP_EVENT_KEY,
  V1CONFIGURE_EVENT_KEY
} from './constants/v1EntityKeys'
import {
  CONFIGURE_EVENT_KEY,
  DISTRIBUTED_PAYOUTS_EVENT_KEY,
  DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY,
  SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY
} from './constants/v2v3EntityKeys'
import { ProjectEventFilter } from './types/eventFilters'

export function useProjectEventKeys({
  eventFilter,
}: {
  eventFilter: ProjectEventFilter | undefined
}) {
  return useMemo(() => {
    let key = undefined

    switch (eventFilter) {
      case 'addToBalance':
        key = ADD_TO_BALANCE_EVENT_KEY
        break
      case 'burn':
        key = BURN_EVENT_KEY
        break
      case 'configure':
        key = CONFIGURE_EVENT_KEY
        break
      case 'deployERC20':
        key = DEPLOYED_ERC20_EVENT_KEY
        break
      case 'deployETHERC20ProjectPayer':
        key = DEPLOYED_PROJECT_PAYER_EVENT_KEY
        break
      case 'distributePayouts':
        key = DISTRIBUTED_PAYOUTS_EVENT_KEY
        break
      case 'distributeTokens':
        key = DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY
        break
      case 'pay':
        key = PAY_EVENT_KEY
        break
      case 'printReserves':
        key = PRINT_RESERVES_EVENT_KEY
        break
      case 'projectCreate':
        key = PROJECT_CREATE_EVENT_KEY
        break
      case 'redeem':
        key = REDEEM_EVENT_KEY
        break
      case 'setFundAccessConstraints':
        key = SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY
        break
      case 'tap':
        key = TAP_EVENT_KEY
        break
      case 'v1Configure':
        key = V1CONFIGURE_EVENT_KEY
        break
    }

    return key
      ? [key]
      : // if no filter, filter for all events
        [
          ADD_TO_BALANCE_EVENT_KEY,
          BURN_EVENT_KEY,
          CONFIGURE_EVENT_KEY,
          DEPLOYED_ERC20_EVENT_KEY,
          DEPLOYED_PROJECT_PAYER_EVENT_KEY,
          DISTRIBUTED_PAYOUTS_EVENT_KEY,
          DISTRIBUTED_RESERVED_TOKENS_EVENT_KEY,
          PAY_EVENT_KEY,
          PRINT_RESERVES_EVENT_KEY,
          PROJECT_CREATE_EVENT_KEY,
          REDEEM_EVENT_KEY,
          SET_FUND_ACCESS_CONSTRAINTS_EVENT_KEY,
          V1CONFIGURE_EVENT_KEY,
        ]
  }, [eventFilter])
}
