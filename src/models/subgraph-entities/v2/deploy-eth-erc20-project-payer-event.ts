import {
  BaseEventEntity,
  parseBaseEventEntityJson,
} from '../base/base-event-entity'
import {
  BaseProjectEntity,
  BaseProjectEntityJson,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface DeployETHERC20ProjectPayerEvent
  extends BaseEventEntity,
    BaseProjectEntity {
  address: string
  beneficiary: string
  preferClaimedTokens: boolean
  preferAddToBalance: boolean
  directory: string
  owner: string
  memo: string
  metadata: string
}

export type DeployETHERC20ProjectPayerEventJson = Partial<
  Record<keyof DeployETHERC20ProjectPayerEvent, string> &
    BaseProjectEntityJson &
    BaseProjectEntityJson
>

export const parseDeployETHERC20ProjectPayerEventJson = (
  j: DeployETHERC20ProjectPayerEventJson,
): Partial<DeployETHERC20ProjectPayerEvent> => ({
  ...parseBaseEventEntityJson(j),
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
