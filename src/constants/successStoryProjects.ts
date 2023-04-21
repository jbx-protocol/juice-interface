import { PV_V1, PV_V2 } from 'constants/pv'
import { ProjectTagName } from 'models/project-tags'
import { PV } from 'models/pv'
import { Project } from 'models/subgraph-entities/vX/project'

export type SuccessStoryProject = {
  project: Project | undefined
  tags: ProjectTagName[]
}

export const CASE_STUDY_PROJECTS: {
  pv: PV
  id: number
  tags: ProjectTagName[]
}[] = [
  {
    pv: PV_V1,
    id: 36, // cdao
    tags: ['fundraising', 'dao'],
  },
  {
    pv: PV_V1,
    id: 199, // moondao
    tags: ['fundraising', 'dao'],
  },
  {
    pv: PV_V1,
    id: 7, // sharkdao
    tags: ['dao'],
  },
  {
    pv: PV_V2,
    id: 311, // studiodao
    tags: ['nfts', 'dao'],
  },
]
