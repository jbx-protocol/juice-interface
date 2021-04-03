import { Budget } from '../models/budget'

export const budgetsDiff = (a?: Budget, b?: Budget) => {
  if (a && !b) return true
  if (b && !a) return true
  return !(
    a?.bondingCurveRate.eq(b?.bondingCurveRate ?? -1) &&
    a?.ballot === b?.ballot &&
    a?.configured.eq(b?.configured ?? -1) &&
    a?.currency.eq(b?.currency ?? -1) &&
    a?.discountRate.eq(b?.discountRate ?? -1) &&
    a?.duration.eq(b?.duration ?? -1) &&
    a?.fee.eq(b?.fee ?? -1) &&
    a?.id.eq(b?.id ?? -1) &&
    a?.number.eq(b?.number ?? -1) &&
    a?.reserved.eq(b?.reserved ?? -1) &&
    a?.previous.eq(b?.previous ?? -1) &&
    a?.start.eq(b?.start ?? -1) &&
    a?.tappedTarget.eq(b?.tappedTarget ?? -1) &&
    a?.tappedTotal.eq(b?.tappedTotal ?? -1) &&
    a?.target.eq(b?.target ?? -1) &&
    a?.weight.eq(b?.weight ?? -1)
  )
}
