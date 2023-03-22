import { ActivityQueryKey } from '../types/eventFilters'

export const PAY_EVENT_KEY: ActivityQueryKey<'payEvent'> = {
  entity: 'payEvent',
  keys: [
    'amount',
    'timestamp',
    'from',
    'beneficiary',
    'note',
    'id',
    'txHash',
    'feeFromV2Project',
    'terminal',
  ],
}

export const BURN_EVENT_KEY: ActivityQueryKey<'burnEvent'> = {
  entity: 'burnEvent',
  keys: ['id', 'timestamp', 'txHash', 'from', 'holder', 'amount'],
}

export const ADD_TO_BALANCE_EVENT_KEY: ActivityQueryKey<'addToBalanceEvent'> = {
  entity: 'addToBalanceEvent',
  keys: ['amount', 'timestamp', 'from', 'note', 'id', 'txHash', 'terminal'],
}

export const DEPLOYED_ERC20_EVENT_KEY: ActivityQueryKey<'deployedERC20Event'> =
  {
    entity: 'deployedERC20Event',
    keys: ['symbol', 'txHash', 'timestamp', 'id', 'from'],
  }

export const REDEEM_EVENT_KEY: ActivityQueryKey<'redeemEvent'> = {
  entity: 'redeemEvent',
  keys: [
    'id',
    'from',
    'amount',
    'beneficiary',
    'txHash',
    'timestamp',
    'returnAmount',
    'terminal',
    'metadata',
    'memo',
  ],
}

export const PROJECT_CREATE_EVENT_KEY: ActivityQueryKey<'projectCreateEvent'> =
  {
    entity: 'projectCreateEvent',
    keys: ['id', 'txHash', 'timestamp', 'from'],
  }

export const DEPLOYED_PROJECT_PAYER_EVENT_KEY: ActivityQueryKey<'deployETHERC20ProjectPayerEvent'> =
  {
    entity: 'deployETHERC20ProjectPayerEvent',
    keys: ['id', 'timestamp', 'txHash', 'from', 'address', 'memo'],
  }
