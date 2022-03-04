import Loading from 'components/shared/Loading'
import { layouts } from 'constants/styles/layouts'
import { useProjectsVxQuery } from 'hooks/v1/Projects'
import { ProjectVx } from 'models/subgraph-entities/project'

import ProjectCard from './ProjectCard'

export default function V2Projects() {
  const { data: projects, isLoading } = useProjectsVxQuery({
    orderBy: 'createdAt',
    orderDirection: 'desc',
    pageSize: 1000,
    cv: 2,
  })

  return (
    <div style={layouts.maxWidth}>
      <h1>V2 Projects</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {projects?.map(project => (
            <div style={{ marginBottom: 20 }}>
              <ProjectCard project={project as ProjectVx} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
