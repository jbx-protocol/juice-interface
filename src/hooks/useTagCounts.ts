import axios from 'axios'
import { ProjectTagName } from 'models/project-tags'
import { useQuery } from 'react-query'

export function useTagCounts() {
  return useQuery<
    Partial<Record<ProjectTagName, number>>,
    Error,
    Partial<Record<ProjectTagName, number>>,
    [string]
  >(
    ['tag-counts'],
    () =>
      axios
        .get<Partial<Record<ProjectTagName, number>>>(
          '/api/projects/tag-counts',
        )
        .then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
    },
  )
}
