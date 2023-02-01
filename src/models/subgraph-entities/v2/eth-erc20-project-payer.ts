import { Json, primitives } from '../../json'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface ETHERC20ProjectPayer extends BaseProjectEntity {
  address: string
  beneficiary: string
  preferClaimedTokens: boolean
  preferAddToBalance: boolean
  directory: string
  owner: string
  memo: string
  metadata: string
}

export const parseETHERC20ProjectPayer = (
  j: Json<ETHERC20ProjectPayer>,
): ETHERC20ProjectPayer => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
})
