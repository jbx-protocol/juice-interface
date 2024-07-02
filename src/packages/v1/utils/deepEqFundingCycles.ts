import { V1FundingCycle } from 'packages/v1/models/fundingCycle'

export const deepEqFundingCycles = (a?: V1FundingCycle, b?: V1FundingCycle) => {
  if (a && !b) return false
  if (b && !a) return false
  return (
    a?.ballot === b?.ballot &&
    a?.configured === (b?.configured ?? -1) &&
    a?.currency === (b?.currency ?? -1) &&
    a?.cycleLimit === (b?.cycleLimit ?? -1) &&
    a?.discountRate === (b?.discountRate ?? -1) &&
    a?.duration === (b?.duration ?? -1) &&
    a?.fee === (b?.fee ?? -1) &&
    a?.id === (b?.id ?? -1) &&
    a?.metadata === (b?.metadata ?? -1) &&
    a?.number === (b?.number ?? -1) &&
    a?.basedOn === (b?.basedOn ?? -1) &&
    a?.projectId === (b?.projectId ?? -1) &&
    a?.start === (b?.start ?? -1) &&
    a?.tapped === (b?.tapped ?? -1) &&
    a?.target === (b?.target ?? -1) &&
    a?.weight === (b?.weight ?? -1)
  )
}
