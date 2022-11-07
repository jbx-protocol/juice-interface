import { PV } from 'models/pv'

import { parseProjectJson, Project, ProjectJson } from '../vX/project'

export interface BaseProjectEntity {
  id: string
  pv: PV
  project: Partial<Project>
  projectId: number
}

export type BaseProjectEntityJson = Partial<
  Record<Exclude<keyof BaseProjectEntity, 'project'>, string> & {
    project: ProjectJson
  }
>

export const parseBaseProjectEntityJson = (
  j: BaseProjectEntityJson,
): Partial<BaseProjectEntity> => ({
  id: j.id,
  pv: j.pv ? (j.pv as PV) : undefined,
  project: j.project ? parseProjectJson(j.project) : undefined,
  projectId: j.projectId ? parseInt(j.projectId) : undefined,
})
