import { ActivityQueryKey } from '../types/eventFilters'

export const PAY_EVENT_KEY: ActivityQueryKey<'payEvent'> = {
  entity: 'payEvent',
  keys: [
    'amount',
    'timestamp',
    'caller',
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
  keys: ['id', 'timestamp', 'txHash', 'caller', 'holder', 'amount'],
}

export const ADD_TO_BALANCE_EVENT_KEY: ActivityQueryKey<'addToBalanceEvent'> = {
  entity: 'addToBalanceEvent',
  keys: ['amount', 'timestamp', 'caller', 'note', 'id', 'txHash', 'terminal'],
}

export const DEPLOYED_ERC20_EVENT_KEY: ActivityQueryKey<'deployedERC20Event'> =
  {
    entity: 'deployedERC20Event',
    keys: ['symbol', 'txHash', 'timestamp', 'id', 'caller'],
  }

export const REDEEM_EVENT_KEY: ActivityQueryKey<'redeemEvent'> = {
  entity: 'redeemEvent',
  keys: [
    'id',
    'caller',
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
    keys: ['id', 'txHash', 'timestamp', 'caller'],
  }

export const DEPLOYED_PROJECT_PAYER_EVENT_KEY: ActivityQueryKey<'deployETHERC20ProjectPayerEvent'> =
  {
    entity: 'deployETHERC20ProjectPayerEvent',
    keys: ['id', 'timestamp', 'txHash', 'caller', 'address', 'memo'],
  }
