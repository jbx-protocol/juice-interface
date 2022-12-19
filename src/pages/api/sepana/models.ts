import { Project } from 'models/subgraph-entities/vX/project'

export type SepanaProject = Project & {
  name?: string
  description?: string
  logoUri?: string
  lastUpdated?: number
}
