import { parseSubgraphEntitiesFromJson } from 'utils/graph'

import { Json } from '../../json'
import { BaseEventEntity } from '../base/base-event-entity'
import { Project } from '../vX/project'

export interface InitEvent extends BaseEventEntity {
  projectId: number
  project: Project

  timestamp: number
  configuration: number
  basedOn: number
}

export const parseInitEventJson = (j: Json<InitEvent>): InitEvent => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
})
