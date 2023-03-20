import { SGEntityKey, SGEntityName } from 'models/graph'

type SharedEventFilter =
  | 'all'
  | 'addToBalance'
  | 'burn'
  | 'deployERC20'
  | 'pay'
  | 'projectCreate'
  | 'redeem'

export type V1EventFilter =
  | 'printReserves'
  | 'tap'
  | 'v1Configure'
  | SharedEventFilter

export type V2V3EventFilter =
  | 'configure'
  | 'distributePayouts'
  | 'distributeTokens'
  | 'deployETHERC20ProjectPayer'
  | 'setFundAccessConstraints'
  | SharedEventFilter

export type ProjectEventFilter = V1EventFilter | V2V3EventFilter

export type ActivityQueryKey<E extends SGEntityName> = {
  entity: E
  keys: SGEntityKey<E>[]
}
