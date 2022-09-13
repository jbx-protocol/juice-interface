import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import { parseProjectJson, Project, ProjectJson } from '../vX/project'

export interface TapEvent extends BaseEventEntity {
  project: Partial<Project>
  fundingCycleId: BigNumber
  beneficiary: string
  amount: BigNumber
  currency: BigNumber
  netTransferAmount: BigNumber
  beneficiaryTransferAmount: BigNumber
  govFeeAmount: BigNumber
}

export type TapEventJson = Partial<
  Record<Exclude<keyof TapEvent, 'project'>, string> & {
    project: ProjectJson
  } & BaseEventEntityJson
>

export const parseTapEventJson = (j: TapEventJson): Partial<TapEvent> => ({
  ...parseBaseEventEntityJson(j),
  project: j.project ? parseProjectJson(j.project) : undefined,
  fundingCycleId: j.fundingCycleId
    ? BigNumber.from(j.fundingCycleId)
    : undefined,
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  currency: j.currency ? BigNumber.from(j.currency) : undefined,
  netTransferAmount: j.netTransferAmount
    ? BigNumber.from(j.netTransferAmount)
    : undefined,
  beneficiaryTransferAmount: j.beneficiaryTransferAmount
    ? BigNumber.from(j.beneficiaryTransferAmount)
    : undefined,
  govFeeAmount: j.govFeeAmount ? BigNumber.from(j.govFeeAmount) : undefined,
})
