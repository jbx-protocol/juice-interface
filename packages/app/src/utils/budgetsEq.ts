import { Budget } from '../models/budget'

export const budgetsEq = (a?: Budget, b?: Budget) => {
  if ((a && !b) || (b && !a)) return true

  if (!a && !b) return false

  return !a?.id.eq(b?.id || 0)
}
