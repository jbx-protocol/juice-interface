import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
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

export const parseDeployETHERC20ProjectPayerEventJson = (
  j: Json<DeployETHERC20ProjectPayerEvent>,
): DeployETHERC20ProjectPayerEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
})
