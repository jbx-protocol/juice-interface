import { ProjectMetadataV5 } from 'models/project-metadata'
import { ProjectJson } from 'models/subgraph-entities/vX/project'

// Project type stored in Sepana db
export type SepanaProject = ProjectJson &
  Pick<ProjectMetadataV5, 'description' | 'logoUri' | 'name'> & {
    lastUpdated: number
  }

export type SepanaSearchResponse<T> = {
  hits: {
    total: {
      value: number
      relation: string
    }
    max_score: number
    hits: {
      _index: string
      _type: string
      _id: string
      _score: number
      _source: T
    }[]
  }
}

export type SepanaBigNumber = { type: 'BigNumber'; hex: string }
