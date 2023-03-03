import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { useProjectTagsQuery } from 'hooks/Projects'
import { ProjectTag } from 'models/project-tags'

export default function ProjectTagSpotlight({
  tag,
  count,
}: {
  tag: ProjectTag
  count?: number
}) {
  const { data: projects, isLoading } = useProjectTagsQuery([tag], {
    pageSize: count,
  })

  return (
    <div>
      <h2>Top {tag} projects</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid>
          {projects?.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </Grid>
      )}
    </div>
  )
}
