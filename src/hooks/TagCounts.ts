import axios from 'axios'
import { ProjectTag } from 'models/project-tags'
import { useQuery } from 'react-query'

export function useTagCounts() {
  return useQuery<
    Partial<Record<ProjectTag, number>>,
    Error,
    Partial<Record<ProjectTag, number>>,
    [string]
  >(
    ['tag-counts'],
    () =>
      axios
        .get<Partial<Record<ProjectTag, number>>>('/api/projects/tag-counts')
        .then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
    },
  )
}
