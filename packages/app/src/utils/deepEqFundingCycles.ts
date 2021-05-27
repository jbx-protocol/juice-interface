import { FundingCycle } from 'models/funding-cycle'

export const deepEqFundingCycles = (a?: FundingCycle, b?: FundingCycle) => {
  if (a && !b) return false
  if (b && !a) return false
  return (
    a?.ballot === b?.ballot &&
    a?.configured === (b?.configured ?? -1) &&
    a?.currency === (b?.currency ?? -1) &&
    a?.discountRate === (b?.discountRate ?? -1) &&
    a?.duration === (b?.duration ?? -1) &&
    a?.fee === (b?.fee ?? -1) &&
    a?.id.eq(b?.id ?? -1) &&
    a?.metadata.eq(b?.metadata ?? -1) &&
    a?.number.eq(b?.number ?? -1) &&
    a?.previous.eq(b?.previous ?? -1) &&
    a?.projectId.eq(b?.projectId ?? -1) &&
    a?.start === (b?.start ?? -1) &&
    a?.tapped.eq(b?.tapped ?? -1) &&
    a?.target.eq(b?.target ?? -1) &&
    a?.weight.eq(b?.weight ?? -1)
  )
}
