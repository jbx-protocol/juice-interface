import { Budget } from '../models/budget'

export const budgetsDiff = (a?: Budget, b?: Budget) => {
  if (a && !b) return true
  if (b && !a) return true
  return !(
    a?.b.eq(b?.b ?? -1) &&
    a?.bAddress === b?.bAddress &&
    a?.discountRate.eq(b?.discountRate ?? -1) &&
    a?.duration.eq(b?.duration ?? -1) &&
    a?.hasMintedReserves === b?.hasMintedReserves &&
    a?.id.eq(b?.id ?? -1) &&
    a?.link === b?.link &&
    a?.name === b?.name &&
    a?.number.eq(b?.number ?? -1) &&
    a?.p.eq(b?.p ?? -1) &&
    a?.previous.eq(b?.previous ?? -1) &&
    a?.project === b?.project &&
    a?.start.eq(b?.start ?? -1) &&
    a?.tapped.eq(b?.tapped ?? -1) &&
    a?.target.eq(b?.target ?? -1) &&
    a?.total.eq(b?.total ?? -1) &&
    a?.want === b?.want &&
    a?.weight.eq(b?.weight ?? -1)
  )
}
