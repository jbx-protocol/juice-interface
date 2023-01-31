import axios from 'axios'
import { PID } from 'models/project'
import { SepanaProjectTimeline } from 'models/sepana'
import { useQuery } from 'react-query'
import { minutesToMillis } from 'utils/units'

export function useProjectTimeline(id: PID | undefined) {
  return useQuery(
    ['sepana-query', id],
    () =>
      id
        ? axios
            .get<SepanaProjectTimeline>(`/api/sepana/timelines/${id}`)
            .then(res => res.data)
        : undefined,
    {
      staleTime: minutesToMillis(3),
    },
  )
}
