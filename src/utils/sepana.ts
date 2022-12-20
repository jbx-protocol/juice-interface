import axios from 'axios'
import { SepanaProject, SepanaProjectJson } from 'models/sepana'
import { parseProjectJson } from 'models/subgraph-entities/vX/project'

/**
 * Search sepana projects for query and return only a list of projects
 * @param query text to search
 * @param opts
 * @returns list of projects
 */
export async function searchSepanaProjectsList(query = '', pageSize?: number) {
  return axios
    .get<{ hits: SepanaProjectJson[] }>(
      `/api/sepana/projects?text=${query}` +
        (pageSize !== undefined ? `&pageSize=${pageSize}` : ''),
    )
    .then(res => res.data.hits.map(h => parseProjectJson(h) as SepanaProject))
}
