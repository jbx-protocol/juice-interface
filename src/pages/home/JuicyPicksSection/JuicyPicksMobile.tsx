import { useTrendingProjects } from 'hooks/Projects'
import { ProjectCarousel } from '../ProjectCarousel'

export function JuicyPicksMobile() {
  const { data: trendingProjects } = useTrendingProjects(5)
  return <ProjectCarousel projects={trendingProjects} />
}
