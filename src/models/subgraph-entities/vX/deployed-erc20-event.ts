import { PV } from 'models/project'

import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface DeployedERC20Event extends BaseProjectEntity, BaseEventEntity {
  pv: PV
  symbol: string
}

export const parseDeployedERC20EventJson = (
  j: Json<DeployedERC20Event>,
): DeployedERC20Event => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
})
