import { parseSubgraphEntitiesFromJson } from 'utils/graph'

import { Json } from '../../json'
import { Project } from '../vX/project'

/**
 * Base type for entities that correspond to a project entity
 */
export interface BaseProjectEntity {
  id: string
  project: Project
  projectId: number
}

export const parseBaseProjectEntityJson = (
  j: Json<BaseProjectEntity>,
): BaseProjectEntity => ({
  ...j,
  ...parseSubgraphEntitiesFromJson(j, ['project']),
})
