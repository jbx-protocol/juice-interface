import {
  BaseProjectEntity,
  BaseProjectEntityJson,
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

export type ETHERC20ProjectPayerJson = Partial<
  Record<keyof ETHERC20ProjectPayer, string> & BaseProjectEntityJson
>

export const parseETHERC20ProjectPayer = (
  j: ETHERC20ProjectPayerJson,
): Partial<ETHERC20ProjectPayer> => ({
  ...parseBaseProjectEntityJson(j),
  address: j.address,
  beneficiary: j.beneficiary,
  preferClaimedTokens: !!j.preferClaimedTokens,
  preferAddToBalance: !!j.preferAddToBalance,
  directory: j.directory,
  owner: j.owner,
  memo: j.memo,
  metadata: j.metadata,
})
