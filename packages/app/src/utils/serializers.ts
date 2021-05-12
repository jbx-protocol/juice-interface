import { BigNumber } from '@ethersproject/bignumber'
import { fromWad, parsePerMille, parseWad } from 'utils/formatCurrency'

import { FundingCycle } from '../models/funding-cycle'
import { fromPerMille } from './formatCurrency'

export type EditingFundingCycle = Omit<FundingCycle, 'metadata'> & {
  reserved: number
  bondingCurveRate: number
}

export type SerializedFundingCycle = Record<keyof EditingFundingCycle, string>

export const serializeFundingCycle = (
  fc: EditingFundingCycle,
): SerializedFundingCycle => ({
  projectId: fc.projectId.toString(),
  id: fc.id.toString(),
  number: fc.number.toString(),
  previous: fc.previous.toString(),
  target: fromWad(fc.target),
  currency: fc.currency.toString(),
  start: fc.start.toString(),
  duration: fc.duration.toString(),
  tapped: fromWad(fc.tapped),
  reserved: fromPerMille(fc.reserved),
  weight: fromWad(fc.weight),
  fee: fromPerMille(fc.fee),
  bondingCurveRate: fromPerMille(fc.bondingCurveRate),
  discountRate: fromPerMille(fc.discountRate),
  configured: fc.configured.toString(),
  ballot: fc.ballot,
})

export const deserializeFundingCycle = (
  fc: SerializedFundingCycle,
): EditingFundingCycle =>
  fc
    ? {
        ...fc,
        projectId: BigNumber.from(fc.projectId),
        id: BigNumber.from(fc.id),
        number: BigNumber.from(fc.number),
        previous: BigNumber.from(fc.previous),
        target: parseWad(fc.target),
        currency: parseInt(fc.currency) as 0 | 1,
        start: parseInt(fc.start),
        duration: parseInt(fc.duration),
        tapped: parseWad(fc.tapped),
        weight: parseWad(fc.weight),
        fee: parsePerMille(fc.fee).toNumber(),
        reserved: parsePerMille(fc.reserved).toNumber(),
        bondingCurveRate: parsePerMille(fc.bondingCurveRate).toNumber(),
        discountRate: parsePerMille(fc.discountRate).toNumber(),
        configured: parseInt(fc.configured),
        ballot: fc.ballot,
      }
    : fc
