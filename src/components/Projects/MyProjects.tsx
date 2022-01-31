import Grid from 'components/shared/Grid'
import ProjectCard from 'components/shared/ProjectCard'
import { NetworkContext } from 'contexts/networkContext'
import { useMyProjectsQuery } from 'hooks/Projects'
import { useContext } from 'react'

export default function MyProjects() {
  const { userAddress } = useContext(NetworkContext)

  const { data: projects } = useMyProjectsQuery(userAddress)

  if (projects) {
    return (
      <Grid
        children={projects.map(p => (
          <ProjectCard project={p} />
        ))}
      />
    )
  } else {
    return <div>You have not contributed to any Juicebox projects</div>
  }
}
