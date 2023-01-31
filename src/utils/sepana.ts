import { Json } from 'models/json'
import { SepanaProject } from 'models/sepana'
import { parseBigNumberKeyVals } from './graph'

export const parseSepanaProjectJson = (
  j: Json<SepanaProject>,
): SepanaProject => ({
  ...j,
  ...parseBigNumberKeyVals(j, ['currentBalance', 'totalPaid', 'trendingScore']),
})
