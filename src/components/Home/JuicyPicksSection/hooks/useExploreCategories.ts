import { useTagCounts } from 'hooks/useTagCounts'
import { ProjectTagName } from 'models/project-tags'

export const useExploreCategories = () => {
  const { isLoading, error, data } = useTagCounts()

  const tags = Object.entries(data ?? {})
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key) as ProjectTagName[]

  return {
    isLoading,
    error,
    tags,
  }
}
