import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { useProjects } from 'hooks/Projects'
import { useParams } from 'react-router'

export default function Owner() {
  const { owner }: { owner?: string } = useParams()

  const projects = useProjects(owner)

  return (
    <div style={{ ...layouts.maxWidth }}>
      <h1 style={{ marginBottom: 40 }}>Owned by {owner}</h1>
      <ProjectsGrid
        projects={Object.values(projects).sort((a, b) =>
          a.name < b.name ? -1 : 1,
        )}
      />
    </div>
  )
}
