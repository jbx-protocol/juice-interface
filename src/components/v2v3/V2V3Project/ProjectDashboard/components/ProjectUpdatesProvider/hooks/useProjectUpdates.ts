import axios from 'axios'
import { useCallback, useReducer } from 'react'
import { ProjectUpdate } from '../ProjectUpdatesProvider'
import { projectUpdatesReducer } from '../utils/projectUpdatesReducer'
import { useFactoredProjectId } from './useFactoredProjectId'

export const useProjectUpdates = () => {
  const projectId = useFactoredProjectId()

  const [state, dispatch] = useReducer(projectUpdatesReducer, {
    projectUpdates: [],
    loading: false,
    error: undefined,
  })

  const loadProjectUpdates = useCallback(async () => {
    if (!projectId) return
    dispatch({ type: 'loading' })
    try {
      const result = await axios.get<(ProjectUpdate & { createdAt: string })[]>(
        `/api/projects/${projectId}/updates`,
      )
      const projectUpdates = result.data
        ? result.data.map(update => ({
            ...update,
            createdAt: new Date(update.createdAt),
          }))
        : []
      dispatch({
        type: 'success',
        projectUpdates,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e)
      dispatch({ type: 'error', error: e.message })
    }
  }, [projectId])

  return {
    ...state,
    loadProjectUpdates,
  }
}
