import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { useProjects } from 'hooks/Projects'

export default function Projects() {
  const projects = useProjects(null)

  return (
    <div style={{ ...layouts.maxWidth }}>
      <h1 style={{ marginBottom: 40 }}>Projects on Juice</h1>
      <ProjectsGrid projects={Object.values(projects)} />
    </div>
  )
}
