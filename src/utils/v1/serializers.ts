import { BigNumber } from '@ethersproject/bignumber'
import { V1FundingCycle } from 'models/v1/fundingCycle'
import {
  fromPerbicent,
  fromPermille,
  fromWad,
  parsePerbicent,
  parsePermille,
  parseWad,
} from 'utils/formatNumber'

// Spreads all properties from both v0 or v1 FundingCycleMetadata
export type EditingV1FundingCycle = Omit<V1FundingCycle, 'metadata'> & {
  reserved: BigNumber
  bondingCurveRate: BigNumber
  payIsPaused: boolean | null
  ticketPrintingIsAllowed: boolean | null
  treasuryExtension: string | null
}

export type SerializedV1FundingCycle = Record<
  keyof Omit<
    EditingV1FundingCycle,
    'payIsPaused' | 'ticketPrintingIsAllowed' | 'treasuryExtension'
  >,
  string
> &
  Record<
    keyof Pick<
      EditingV1FundingCycle,
      'payIsPaused' | 'ticketPrintingIsAllowed'
    >,
    null | boolean
  > &
  Record<keyof Pick<EditingV1FundingCycle, 'treasuryExtension'>, null | string>

export const serializeV1FundingCycle = (
  fc: EditingV1FundingCycle,
): SerializedV1FundingCycle => ({
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
  ticketPrintingIsAllowed: fc.ticketPrintingIsAllowed,
  treasuryExtension: fc.treasuryExtension,
})

export const deserializeV1FundingCycle = (
  fc: SerializedV1FundingCycle,
): EditingV1FundingCycle => ({
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
  payIsPaused: fc.payIsPaused,
  ticketPrintingIsAllowed: fc.ticketPrintingIsAllowed,
  treasuryExtension: fc.treasuryExtension,
})
