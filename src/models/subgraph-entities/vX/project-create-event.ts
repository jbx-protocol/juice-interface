import { PV } from 'models/pv'
import { Json, primitives } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import {
  BaseProjectEntity,
  parseBaseProjectEntityJson,
} from '../base/base-project-entity'

export interface ProjectCreateEvent extends BaseEventEntity, BaseProjectEntity {
  pv: PV
}

export const parseProjectCreateEventJson = (
  j: Json<ProjectCreateEvent>,
): ProjectCreateEvent => ({
  ...primitives(j),
  ...parseBaseProjectEntityJson(j),
})
