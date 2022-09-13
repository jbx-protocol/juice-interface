import { V1FundingCycle } from 'models/v1/fundingCycle'

export const deepEqFundingCycles = (a?: V1FundingCycle, b?: V1FundingCycle) => {
  if (a && !b) return false
  if (b && !a) return false
  return (
    a?.ballot === b?.ballot &&
    a?.configured.eq(b?.configured ?? -1) &&
    a?.currency === (b?.currency ?? -1) &&
    a?.cycleLimit === (b?.cycleLimit ?? -1) &&
    a?.discountRate.eq(b?.discountRate ?? -1) &&
    a?.duration.eq(b?.duration ?? -1) &&
    a?.fee.eq(b?.fee ?? -1) &&
    a?.id.eq(b?.id ?? -1) &&
    a?.metadata.eq(b?.metadata ?? -1) &&
    a?.number.eq(b?.number ?? -1) &&
    a?.basedOn.eq(b?.basedOn ?? -1) &&
    a?.projectId.eq(b?.projectId ?? -1) &&
    a?.start.eq(b?.start ?? -1) &&
    a?.tapped.eq(b?.tapped ?? -1) &&
    a?.target.eq(b?.target ?? -1) &&
    a?.weight.eq(b?.weight ?? -1)
  )
}
