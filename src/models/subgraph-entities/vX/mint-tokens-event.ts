import { BigNumber } from 'ethers'
import { PV } from 'models/pv'
import { parseBigNumberKeyVal } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface MintTokensEvent extends BaseEventEntity, BaseProjectEntity {
  pv: PV
  beneficiary: string
  amount: BigNumber
  memo: string
}

export const parseMintTokensEventJson = (
  j: Json<MintTokensEvent>,
): MintTokensEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVal('amount', j.amount),
})
