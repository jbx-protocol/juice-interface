import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { DBProject } from 'models/dbProject'
import { Json } from 'models/json'
import { parseDBProjectJson } from 'utils/sgDbProjects'

export function useTrendingProjects(count: number) {
  return useQuery({
    queryKey: ['trending-projects', count],
    queryFn: async () => {
      const res = await axios.get<Json<DBProject>[]>(
        '/api/projects/trending?count=' + count,
      )

      return res.data.map(parseDBProjectJson)
    },
  })
}
