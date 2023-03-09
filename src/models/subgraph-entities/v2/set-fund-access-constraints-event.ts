import { BigNumber } from '@ethersproject/bignumber'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { parseBigNumberKeyVals } from 'utils/graph'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface SetFundAccessConstraintsEvent
  extends BaseEventEntity,
    BaseProjectEntity {
  distributionLimit: BigNumber
  distributionLimitCurrency: V2V3CurrencyOption
  overflowAllowance: BigNumber
  overflowAllowanceCurrency: V2V3CurrencyOption
  terminal: string
  token: string
  fundingCycleConfiguration: BigNumber
  fundingCycleNumber: number
}

export const parseSetFundAccessConstraintsEvent = (
  j: Json<SetFundAccessConstraintsEvent>,
): SetFundAccessConstraintsEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
  ...parseBigNumberKeyVals(j, [
    'distributionLimit',
    'overflowAllowance',
    'fundingCycleConfiguration',
  ]),
})
