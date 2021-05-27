import { BigNumber } from '@ethersproject/bignumber'
import {
  fromPerbicent,
  fromWad,
  parsePerbicent,
  parseWad,
} from 'utils/formatNumber'

import { FundingCycle } from '../models/funding-cycle'

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
  reserved: fromPerbicent(fc.reserved),
  weight: fromWad(fc.weight),
  fee: fromPerbicent(fc.fee),
  bondingCurveRate: fromPerbicent(fc.bondingCurveRate),
  discountRate: fromPerbicent(fc.discountRate),
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
        fee: parsePerbicent(fc.fee).toNumber(),
        reserved: parsePerbicent(fc.reserved).toNumber(),
        bondingCurveRate: parsePerbicent(fc.bondingCurveRate).toNumber(),
        discountRate: parsePerbicent(fc.discountRate).toNumber(),
        configured: parseInt(fc.configured),
        ballot: fc.ballot,
      }
    : fc
