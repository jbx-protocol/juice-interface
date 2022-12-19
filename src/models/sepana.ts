import { ProjectMetadataV5 } from 'models/project-metadata'
import { Project } from 'models/subgraph-entities/vX/project'

// Project type stored in Sepana db
export type SepanaProject = Project &
  Pick<ProjectMetadataV5, 'description' | 'logoUri' | 'name'> & {
    lastUpdated: number
  }

export type SepanaDoc<T> = { _source: T; _id: string }

export type SepanaSearchResponse<T> = {
  hits: { hits: SepanaDoc<T>[] }
}

export type SepanaBigNumber = { type: 'BigNumber'; hex: string }
