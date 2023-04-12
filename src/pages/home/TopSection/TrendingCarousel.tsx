import { useTrendingProjects } from 'hooks/Projects'
import { useState } from 'react'
import { HomepageProjectCard } from '../HomepageProjectCard'
import { ArrowIcon } from './ArrowIcon'

const TRENDING_PROJECTS_LIMIT = 4

// INCOMPLETE COMPONENT (scrolling doesn't work)
export function TrendingCarousel() {
  const [rankScrolledTo, setRankScrolledTo] = useState<number>(0)

  const { data: trendingProjects } = useTrendingProjects(
    TRENDING_PROJECTS_LIMIT,
  )

  const decrementPosition = () => {
    //scrollTo
    setRankScrolledTo(rankScrolledTo - 1)
  }

  const incrementPosition = () => {
    //scrollTo
    setRankScrolledTo(rankScrolledTo + 1)
  }

  return (
    <div className="mt-10 flex w-full justify-center">
      {rankScrolledTo !== 0 ? (
        <ArrowIcon direction="left" onClick={decrementPosition} />
      ) : null}
      {rankScrolledTo !== TRENDING_PROJECTS_LIMIT ? (
        <ArrowIcon direction="right" onClick={incrementPosition} />
      ) : null}
      <div className="flex w-fit justify-between">
        {trendingProjects?.map(p => (
          <HomepageProjectCard project={p} key={`${p.id}_${p.pv}`} />
        ))}
      </div>
    </div>
  )
}
