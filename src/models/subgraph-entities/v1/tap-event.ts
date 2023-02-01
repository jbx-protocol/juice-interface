import { BigNumber } from '@ethersproject/bignumber'
import {
  parseBigNumberKeyVals,
  parseSubgraphEntitiesFromJson,
} from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface TapEvent extends BaseEventEntity {
  project: Project
  projectId: number
  fundingCycleId: BigNumber
  beneficiary: string
  amount: BigNumber
  amountUSD: BigNumber
  currency: BigNumber
  netTransferAmount: BigNumber
  netTransferAmountUSD: BigNumber
  beneficiaryTransferAmount: BigNumber
  beneficiaryTransferAmountUSD: BigNumber
  govFeeAmount: BigNumber
  govFeeAmountUSD: BigNumber
}

export const parseTapEventJson = (j: Json<TapEvent>): TapEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
  ...parseBigNumberKeyVals(j, [
    'fundingCycleId',
    'amount',
    'amountUSD',
    'currency',
    'netTransferAmount',
    'netTransferAmountUSD',
    'beneficiaryTransferAmount',
    'beneficiaryTransferAmountUSD',
    'govFeeAmount',
    'govFeeAmountUSD',
  ]),
})
