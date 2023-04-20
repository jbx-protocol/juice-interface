import { GraphResult } from 'hooks/SubgraphQuery'
import { Project } from 'models/subgraph-entities/vX/project'
import { classNames } from 'utils/classNames'
import { HomepageProjectCard } from './HomepageProjectCard'

export function ProjectCarousel({
  projects,
  className,
}: {
  projects: GraphResult<'project', keyof Project> | undefined
  className?: string
}) {
  // const [rankScrolledTo, setRankScrolledTo] = useState<number>(0)

  // const decrementPosition = () => {
  //   //scrollTo
  //   setRankScrolledTo(rankScrolledTo - 1)
  // }

  // const incrementPosition = () => {
  //   //scrollTo
  //   setRankScrolledTo(rankScrolledTo + 1)
  // }

  if (!projects) return null

  return (
    <div
      className={classNames(
        'mt-10 flex flex-nowrap justify-start gap-x-8 pb-6 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0',
        className,
      )}
    >
      {/* {rankScrolledTo !== 0 ? (
        <ArrowIcon direction="left" onClick={decrementPosition} />
      ) : null}
      {rankScrolledTo !== TRENDING_PROJECTS_LIMIT ? (
        <ArrowIcon direction="right" onClick={incrementPosition} />
      ) : null} */}
      {/* <div className="flex justify-between flex-nowrap"> */}
      {projects?.map(project => (
        <HomepageProjectCard
          project={project}
          key={`${project.id}_${project.pv}`}
        />
      ))}
      {/* </div> */}
    </div>
  )
}
