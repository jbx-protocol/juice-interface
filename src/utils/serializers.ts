import { BigNumber } from '@ethersproject/bignumber'
import { FundingCycle } from 'models/funding-cycle'
import {
  fromPerbicent,
  fromPermille,
  fromWad,
  parsePerbicent,
  parsePermille,
  parseWad,
} from 'utils/formatNumber'

export type EditingFundingCycle = Omit<FundingCycle, 'metadata'> & {
  reserved: BigNumber
  bondingCurveRate: BigNumber
  payIsPaused: boolean
  printingTicketsIsAllowed: boolean
}

export type SerializedFundingCycle = Record<
  keyof Omit<EditingFundingCycle, 'payIsPaused' | 'printingTicketsIsAllowed'>,
  string
> &
  Record<
    keyof Pick<EditingFundingCycle, 'payIsPaused' | 'printingTicketsIsAllowed'>,
    boolean
  >

export const serializeFundingCycle = (
  fc: EditingFundingCycle,
): SerializedFundingCycle => ({
  projectId: fc.projectId.toString(),
  id: fc.id.toString(),
  number: fc.number.toString(),
  basedOn: fc.basedOn.toString(),
  target: fromWad(fc.target),
  currency: fc.currency.toString(),
  start: fc.start.toString(),
  duration: fc.duration.toString(),
  tapped: fromWad(fc.tapped),
  reserved: fromPerbicent(fc.reserved),
  weight: fromWad(fc.weight),
  fee: fromPerbicent(fc.fee),
  bondingCurveRate: fromPerbicent(fc.bondingCurveRate),
  discountRate: fromPermille(fc.discountRate),
  configured: fc.configured.toString(),
  cycleLimit: fc.cycleLimit.toString(),
  ballot: fc.ballot,
  payIsPaused: fc.payIsPaused,
  printingTicketsIsAllowed: fc.printingTicketsIsAllowed,
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
        basedOn: BigNumber.from(fc.basedOn),
        target: parseWad(fc.target),
        currency: BigNumber.from(fc.currency),
        start: BigNumber.from(fc.start),
        duration: BigNumber.from(fc.duration),
        tapped: parseWad(fc.tapped),
        weight: parseWad(fc.weight),
        fee: parsePerbicent(fc.fee),
        reserved: parsePerbicent(fc.reserved),
        bondingCurveRate: parsePerbicent(fc.bondingCurveRate),
        discountRate: parsePermille(fc.discountRate),
        cycleLimit: BigNumber.from(fc.cycleLimit),
        configured: BigNumber.from(fc.configured),
        ballot: fc.ballot,
      }
    : fc
