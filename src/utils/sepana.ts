import axios from 'axios'
import { SepanaProject } from 'models/sepana'

/**
 * Search sepana projects for query and return only a list of projects
 * @param query text to search
 * @param opts
 * @returns list of projects
 */
export async function searchSepanaProjectsList(query = '', pageSize?: number) {
  return axios
    .get<{ hits: SepanaProject[] }>(
      `/api/sepana/projects?text=${query}` +
        (pageSize !== undefined ? `&pageSize=${pageSize}` : ''),
    )
    .then(res => res.data.hits)
}
