import { BigNumber } from '@ethersproject/bignumber'
import { fromWad, parsePerMille, parseWad } from 'utils/formatCurrency'

import { FundingCycle } from '../models/funding-cycle'
import { fromPerMille } from './formatCurrency'

export type SerializedFundingCycle = Record<keyof FundingCycle, string>

export const serializeFundingCycle = (
  fc: FundingCycle,
): SerializedFundingCycle => ({
  projectId: fc.projectId.toString(),
  id: fc.id.toString(),
  number: fc.number.toString(),
  previous: fc.previous.toString(),
  target: fromWad(fc.target),
  currency: fc.currency.toString(),
  start: fc.start.toString(),
  duration: fc.duration.toString(),
  tappedTarget: fromWad(fc.tappedTarget),
  tappedTotal: fromWad(fc.tappedTotal),
  reserved: fromPerMille(fc.reserved),
  weight: fromWad(fc.weight),
  fee: fromPerMille(fc.fee),
  bondingCurveRate: fromPerMille(fc.bondingCurveRate),
  discountRate: fromPerMille(fc.discountRate),
  configured: fc.configured.toString(),
  ballot: fc.ballot,
})

export const deserializeFundingCycle = (
  fc: SerializedFundingCycle | undefined,
): FundingCycle | undefined =>
  fc
    ? {
        ...fc,
        projectId: BigNumber.from(fc.projectId),
        id: BigNumber.from(fc.id),
        number: BigNumber.from(fc.number),
        previous: BigNumber.from(fc.previous),
        target: parseWad(fc.target),
        currency: BigNumber.from(fc.currency),
        start: BigNumber.from(fc.start),
        duration: BigNumber.from(fc.duration),
        tappedTarget: parseWad(fc.tappedTarget),
        tappedTotal: parseWad(fc.tappedTotal),
        reserved: parsePerMille(fc.reserved),
        weight: parseWad(fc.weight),
        fee: parsePerMille(fc.fee),
        bondingCurveRate: parsePerMille(fc.bondingCurveRate),
        discountRate: parsePerMille(fc.discountRate),
        configured: BigNumber.from(fc.configured),
      }
    : fc
