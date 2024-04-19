import { V1FundingCycle } from 'models/v1/fundingCycle'
import {
  fromWad,
  parseWad,
  perbicentToPercent,
  percentToPerbicent,
  percentToPermille,
  permilleToPercent,
} from 'utils/format/formatNumber'

// Spreads all properties from both v0 or v1 FundingCycleMetadata
export type EditingV1FundingCycle = Omit<V1FundingCycle, 'metadata'> & {
  reserved: bigint
  bondingCurveRate: bigint
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
  reserved: perbicentToPercent(fc.reserved),
  weight: fromWad(fc.weight),
  fee: perbicentToPercent(fc.fee),
  bondingCurveRate: perbicentToPercent(fc.bondingCurveRate),
  discountRate: permilleToPercent(fc.discountRate),
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
  projectId: BigInt(fc.projectId),
  id: BigInt(fc.id),
  number: BigInt(fc.number),
  basedOn: BigInt(fc.basedOn),
  target: parseWad(fc.target),
  currency: BigInt(fc.currency),
  start: BigInt(fc.start),
  duration: BigInt(fc.duration),
  tapped: parseWad(fc.tapped),
  weight: parseWad(fc.weight),
  fee: percentToPerbicent(fc.fee),
  reserved: percentToPerbicent(fc.reserved),
  bondingCurveRate: percentToPerbicent(fc.bondingCurveRate),
  discountRate: percentToPermille(fc.discountRate),
  cycleLimit: BigInt(fc.cycleLimit),
  configured: BigInt(fc.configured),
  ballot: fc.ballot,
  payIsPaused: fc.payIsPaused,
  ticketPrintingIsAllowed: fc.ticketPrintingIsAllowed,
  treasuryExtension: fc.treasuryExtension,
})
