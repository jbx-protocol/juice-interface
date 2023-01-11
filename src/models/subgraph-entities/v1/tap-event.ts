import { BigNumber } from '@ethersproject/bignumber'

import {
  BaseEventEntity,
  BaseEventEntityJson,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import { parseProjectJson, Project, ProjectJson } from '../vX/project'

export interface TapEvent extends BaseEventEntity {
  project: Partial<Project>
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

export type TapEventJson = Partial<
  Record<Exclude<keyof TapEvent, 'project'>, string> & {
    project: ProjectJson
  } & BaseEventEntityJson
>

export const parseTapEventJson = (j: TapEventJson): Partial<TapEvent> => ({
  ...parseBaseEventEntityJson(j),
  project: j.project ? parseProjectJson(j.project) : undefined,
  projectId: j.projectId !== undefined ? parseInt(j.projectId) : undefined,
  fundingCycleId: j.fundingCycleId
    ? BigNumber.from(j.fundingCycleId)
    : undefined,
  beneficiary: j.beneficiary,
  amount: j.amount ? BigNumber.from(j.amount) : undefined,
  amountUSD: j.amountUSD ? BigNumber.from(j.amountUSD) : undefined,
  currency: j.currency ? BigNumber.from(j.currency) : undefined,
  netTransferAmount: j.netTransferAmount
    ? BigNumber.from(j.netTransferAmount)
    : undefined,
  netTransferAmountUSD: j.netTransferAmountUSD
    ? BigNumber.from(j.netTransferAmountUSD)
    : undefined,
  beneficiaryTransferAmount: j.beneficiaryTransferAmount
    ? BigNumber.from(j.beneficiaryTransferAmount)
    : undefined,
  beneficiaryTransferAmountUSD: j.beneficiaryTransferAmountUSD
    ? BigNumber.from(j.beneficiaryTransferAmountUSD)
    : undefined,
  govFeeAmount: j.govFeeAmount ? BigNumber.from(j.govFeeAmount) : undefined,
  govFeeAmountUSD: j.govFeeAmountUSD
    ? BigNumber.from(j.govFeeAmountUSD)
    : undefined,
})
